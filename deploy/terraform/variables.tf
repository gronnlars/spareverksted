variable "domain" {
  description = "Hoveddomenet. Siden er alltid tilgjengelig på https://<domain>/ uansett hvordan den skrives."
  type        = string
  default     = "spareverksted.no"
}

variable "zone_name" {
  description = "Navn på lagringssonen og pull zone. Må være unikt hos bunny.net."
  type        = string
  default     = "spareverksted"
}

variable "routing_filters" {
  description = "Hvilke bunny-regioner trafikken får gå gjennom. EU holder alt innenfor EU. EEA tar også med Norge og Island, hvis leverandøren støtter verdien."
  type        = list(string)
  default     = ["EU"]
}

variable "enable_tls" {
  description = "Slå på sertifikat og tvungen HTTPS på hostnames. Gjør dette først etter at DNS peker på bunny, ellers kan sertifikatet ikke utstedes."
  type        = bool
  default     = false
}

# Fylles automatisk av headers.auto.tfvars.json. Rediger deploy/headers.cjs og kjør: node scripts/sync-security.cjs
variable "security_headers" {
  type = map(string)
}

variable "cache_control_html" {
  type = string
}

variable "cache_control_assets" {
  type = string
}
