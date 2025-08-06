# andasy.hcl app configuration file generated for eventmanagement on Wednesday, 06-Aug-25 15:38:15 SAST
#
# See https://github.com/quarksgroup/andasy-cli for information about how to use this file.

app_name = "eventmanagement"

app {

  env = {}

  port = 3000

  compute {
    cpu      = 1
    memory   = 256
    cpu_kind = "shared"
  }

  process {
    name = "eventmanagement"
  }

}
