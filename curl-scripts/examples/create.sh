#!/bin/bash
API="http://localhost:4741"
URL_PATH="/feedings"
TOKEN=e28ed31684daf7cae3564cbdfafcf1fb
DAY="Monday"
TIME="7h30am,9h30am, 11h30am, 1h30pm, 3h30pm, 5h30pm "
OUNCES="3 oz"
curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "feeding": {
      "day": "'"${DAY}"'",
      "time": "'"${TIME}"'",
      "ounces": "'"${OUNCES}"'"
      
    }
  }'

echo
