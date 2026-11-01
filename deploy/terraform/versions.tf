terraform {
  required_version = ">= 1.5"
  required_providers {
    bunnynet = {
      source = "BunnyWay/bunnynet"
    }
  }
}

# API-nøkkelen leses fra miljøvariabelen BUNNYNET_API_KEY. Skriv den aldri inn i filene.
provider "bunnynet" {}
