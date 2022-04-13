#!/bin/sh
ID="625611c87bc0d44a3ea4f310"
API="http://localhost:4741"
URL_PATH="/feedings"
TOKEN=e28ed31684daf7cae3564cbdfafcf1fb

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"

echo
