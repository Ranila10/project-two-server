#!/bin/sh
TOKEN=e28ed31684daf7cae3564cbdfafcf1fb
API="http://localhost:4741"
URL_PATH="/feedings"

curl "${API}${URL_PATH}" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"

echo
