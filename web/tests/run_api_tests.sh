#!/bin/bash

# Callfolio API Integration Tests
# Requires local server running on http://localhost:3001

BASE_URL="http://localhost:3001"
SECRET="callfolio_secret_2026" # Matches .env.local

echo "🚀 Starting API Integration Tests..."

# 1. Test assistant-request (Identification)
echo -e "\n1. Testing assistant-request (Identification)..."
curl -s -X POST "$BASE_URL/api/vapi/webhook" \
  -H "Content-Type: application/json" \
  -H "x-vapi-secret: $SECRET" \
  -d '{
    "message": {
      "type": "assistant-request",
      "call": {
        "customer": { "number": "+491701234567" },
        "phoneNumberId": "test_phone_id"
      }
    }
  }' | grep -q "assistant" && echo "✅ Success: Assistant response received" || echo "❌ Failed: Identification failed"

# 2. Test submit_ticket
echo -e "\n2. Testing submit_ticket (Webhook)..."
TICKET_RESPONSE=$(curl -s -X POST "$BASE_URL/api/vapi/webhook" \
  -H "Content-Type: application/json" \
  -H "x-vapi-secret: $SECRET" \
  -d '{
    "message": {
      "type": "tool-calls",
      "toolCalls": [{
        "id": "call_123",
        "function": {
          "name": "submit_ticket",
          "arguments": "{\"issue\":{\"summary\":\"Test Ticket\",\"details\":\"Integration Test Details\",\"category\":\"PLUMBING\",\"urgency\":\"MEDIUM\"},\"caller\":{\"name\":\"Test User\",\"phone\":\"+491701234567\"}}"
        }
      }],
      "call": { "id": "test_call_id_999" }
    }
  }')

echo "$TICKET_RESPONSE" | grep -q "success" && echo "✅ Success: Ticket submitted" || echo "❌ Failed: Ticket submission failed"

# 3. Test call-ended (Billing/Duration)
echo -e "\n3. Testing call-ended (Duration Tracking)..."
curl -s -X POST "$BASE_URL/api/vapi/webhook" \
  -H "Content-Type: application/json" \
  -H "x-vapi-secret: $SECRET" \
  -d '{
    "message": {
      "type": "call-ended",
      "call": {
        "id": "test_call_id_999",
        "duration": 125,
        "phoneNumberId": "test_phone_id"
      }
    }
  }' | grep -q "OK" && echo "✅ Success: Call-ended event processed" || echo "❌ Failed: Duration tracking failed"

echo -e "\n🏁 Integration Tests Completed."
