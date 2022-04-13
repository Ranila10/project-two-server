#!/bin/bash
TOKEN="e28ed31684daf7cae3564cbdfafcf1fb"
ID="625611c87bc0d44a3ea4f310"
API="http://localhost:4741"
URL_PATH="/feedings"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request DELETE \
  --header "Authorization: Bearer ${TOKEN}"

echo
