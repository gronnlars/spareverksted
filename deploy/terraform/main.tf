# bunny.net-oppsett for spareverksted.no.
#
# VIKTIG: Denne filen er skrevet uten å kunne kjøre `terraform validate` mot leverandøren.
# Ressursnavnene er bekreftet i bunnys dokumentasjon. Attributtnavn og verdier kan trenge små rettelser.
# Kjør først: terraform init && terraform validate && terraform plan, og les planen før du kjører apply.

# 1. Lagring i Europa: hovedregion Tyskland, ingen replikering utenfor EU.
resource "bunnynet_storage_zone" "site" {
  name                = var.zone_name
  region              = "DE"
  zone_tier           = "Standard"
  replication_regions = []
}

# 2. CDN med europeisk ruting og anonymisert logg.
resource "bunnynet_pullzone" "site" {
  name = var.zone_name

  origin {
    type        = "StorageZone"
    storagezone = bunnynet_storage_zone.site.id
  }

  routing {
    tier    = "Standard"
    filters = var.routing_filters
  }

  # Siste del av IP-adressen byttes ut i loggen. Bruk den sterkeste verdien leverandøren tilbyr.
  log_anonymized          = true
  log_anonymization_type  = "OneDigit"
  cors_enabled            = false
}

# 3. Begge adresser får sertifikat og tvungen HTTPS (http://X sender til https://X først).
resource "bunnynet_pullzone_hostname" "apex" {
  count       = var.enable_tls ? 1 : 0
  pullzone    = bunnynet_pullzone.site.id
  name        = var.domain
  tls_enabled = true
  force_ssl   = true
}

resource "bunnynet_pullzone_hostname" "www" {
  count       = var.enable_tls ? 1 : 0
  pullzone    = bunnynet_pullzone.site.id
  name        = "www.${var.domain}"
  tls_enabled = true
  force_ssl   = true
}

# 4. www sendes til hoveddomenet over HTTPS.
resource "bunnynet_pullzone_edgerule" "www_to_apex" {
  pullzone    = bunnynet_pullzone.site.id
  description = "www til hoveddomenet"
  enabled     = true
  match_type  = "MatchAny"

  triggers = [{
    type       = "Url"
    match_type = "MatchAny"
    patterns   = ["https://www.${var.domain}/*", "http://www.${var.domain}/*"]
  }]

  actions = [{
    type       = "Redirect"
    parameter1 = "https://${var.domain}/{{path}}"
    parameter2 = "301"
  }]
}

# 5. Sikkerhetshodene fra deploy/headers.cjs, på alle svar.
resource "bunnynet_pullzone_edgerule" "security_headers" {
  pullzone    = bunnynet_pullzone.site.id
  description = "Sikkerhetshoder"
  enabled     = true
  match_type  = "MatchAny"

  triggers = [{
    type       = "Url"
    match_type = "MatchAny"
    patterns   = ["*"]
  }]

  actions = [for name, value in var.security_headers : {
    type       = "SetResponseHeader"
    parameter1 = name
    parameter2 = value
  }]
}

# 6. Cache.
resource "bunnynet_pullzone_edgerule" "cache_assets" {
  pullzone    = bunnynet_pullzone.site.id
  description = "Cache for JS og CSS"
  enabled     = true
  match_type  = "MatchAny"

  triggers = [{
    type       = "UrlExtension"
    match_type = "MatchAny"
    patterns   = ["js", "css"]
  }]

  actions = [{
    type       = "SetResponseHeader"
    parameter1 = "Cache-Control"
    parameter2 = var.cache_control_assets
  }]
}

resource "bunnynet_pullzone_edgerule" "cache_html" {
  pullzone    = bunnynet_pullzone.site.id
  description = "HTML sjekkes alltid på nytt"
  enabled     = true
  match_type  = "MatchAny"

  triggers = [{
    type       = "UrlExtension"
    match_type = "MatchAny"
    patterns   = ["html", ""]
  }]

  actions = [{
    type       = "SetResponseHeader"
    parameter1 = "Cache-Control"
    parameter2 = var.cache_control_html
  }]
}

# 7. Bare lesing.
resource "bunnynet_pullzone_edgerule" "read_only" {
  pullzone    = bunnynet_pullzone.site.id
  description = "Avvis alt annet enn GET, HEAD og OPTIONS"
  enabled     = true
  match_type  = "MatchAll"

  triggers = [{
    type       = "RequestMethod"
    match_type = "MatchNone"
    patterns   = ["GET", "HEAD", "OPTIONS"]
  }]

  actions = [{
    type       = "BlockRequest"
    parameter1 = ""
    parameter2 = ""
  }]
}

output "pullzone_hostname" {
  description = "Pek DNS (CNAME for www, Pull Zone-oppføring for hoveddomenet) hit."
  value       = "${bunnynet_pullzone.site.name}.b-cdn.net"
}

output "storage_zone_name" {
  value = bunnynet_storage_zone.site.name
}
