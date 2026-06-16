/**
 * Test Suite for Duplicate Ticket Prevention System
 * 
 * This file contains test scenarios for the duplicate ticket prevention feature.
 * Run these tests manually or integrate with your testing framework.
 */

// Test Data
const TEST_PHONE = "+491701234567";
const TEST_CALLER = {
  name: "Max Mustermann",
  phone: TEST_PHONE
};
const TEST_LOCATION = {
  address: "Musterstraße 123, 80331 München",
  unit: "3. OG links"
};

// Test Scenarios
export const testScenarios = {
  // Scenario 1: First call - no existing ticket
  scenario1_firstCall: {
    description: "Erster Anruf - Neues Ticket erstellen",
    steps: [
      {
        action: "POST /api/vapi/check-ticket",
        payload: { caller_phone: TEST_PHONE },
        expectedResponse: { has_existing: false }
      },
      {
        action: "POST /api/vapi/webhook (submit_ticket)",
        payload: {
          call_id: "test_call_001",
          urgency: "HIGH",
          category: "HEATING",
          sentiment: "STRESSED",
          caller: TEST_CALLER,
          location: TEST_LOCATION,
          issue: {
            summary: "Heizung im Wohnzimmer komplett kalt",
            details: "Seit gestern Abend keine Wärme mehr"
          },
          escalation: { is_emergency: false },
          confidence: { data_complete: true }
        },
        expectedResponse: { status: "ok", stored: true }
      }
    ]
  },

  // Scenario 2: Second call - existing ticket found, user chooses update
  scenario2_updateExisting: {
    description: "Zweiter Anruf - Bestehendes Ticket updaten",
    steps: [
      {
        action: "POST /api/vapi/check-ticket",
        payload: { caller_phone: TEST_PHONE },
        expectedResponse: {
          has_existing: true,
          ticket_id: "HV-2026-000123", // Will be generated from first call
          summary: "Heizung im Wohnzimmer komplett kalt",
          created_at: "2026-01-22T14:30:00Z" // Approximate
        }
      },
      {
        action: "POST /api/vapi/webhook (submit_ticket with existing_ticket_id)",
        payload: {
          call_id: "test_call_002",
          urgency: "HIGH",
          category: "HEATING",
          sentiment: "STRESSED",
          caller: TEST_CALLER,
          location: TEST_LOCATION,
          issue: {
            summary: "Heizung Update",
            details: "Jetzt ist auch das Badezimmer kalt geworden"
          },
          escalation: { is_emergency: false },
          confidence: { data_complete: true },
          existing_ticket_id: "HV-2026-000123"
        },
        expectedResponse: { 
          status: "ok", 
          updated: true, 
          ticket_id: "HV-2026-000123" 
        }
      }
    ]
  },

  // Scenario 3: Second call - existing ticket found, user chooses new ticket
  scenario3_newTicket: {
    description: "Zweiter Anruf - Neues separates Ticket erstellen",
    steps: [
      {
        action: "POST /api/vapi/check-ticket",
        payload: { caller_phone: TEST_PHONE },
        expectedResponse: {
          has_existing: true,
          ticket_id: "HV-2026-000123",
          summary: "Heizung im Wohnzimmer komplett kalt"
        }
      },
      {
        action: "POST /api/vapi/webhook (submit_ticket without existing_ticket_id)",
        payload: {
          call_id: "test_call_003",
          urgency: "MEDIUM",
          category: "PLUMBING",
          sentiment: "CALM",
          caller: TEST_CALLER,
          location: TEST_LOCATION,
          issue: {
            summary: "Wasserhahn tropft in der Küche",
            details: "Seit heute Morgen tropft der Wasserhahn"
          },
          escalation: { is_emergency: false },
          confidence: { data_complete: true }
          // No existing_ticket_id = new ticket
        },
        expectedResponse: { status: "ok", stored: true }
      }
    ]
  },

  // Scenario 4: Call with only closed tickets
  scenario4_closedTickets: {
    description: "Anruf mit nur geschlossenen Tickets - Normaler Flow",
    prerequisites: [
      "Set existing tickets for this phone to status 'CLOSED' or 'RESOLVED'"
    ],
    steps: [
      {
        action: "POST /api/vapi/check-ticket",
        payload: { caller_phone: TEST_PHONE },
        expectedResponse: { has_existing: false }
      },
      {
        action: "Normal ticket creation flow"
      }
    ]
  }
};

// Manual Test Instructions
export const manualTestInstructions = `
# Manual Testing Instructions for Duplicate Prevention

## Setup
1. Ensure your Supabase database has the schema updates applied
2. Set up environment variables in .env.local
3. Start the development server: npm run dev

## Test Execution

### Test 1: First Call (New Ticket)
1. Use Postman or curl to call:
   POST http://localhost:3000/api/vapi/check-ticket
   Headers: x-vapi-secret: your_secret
   Body: {"caller_phone": "+491701234567"}
   
   Expected: {"has_existing": false}

2. Call webhook to create ticket:
   POST http://localhost:3000/api/vapi/webhook
   Headers: x-vapi-secret: your_secret
   Body: [Full ticket payload from scenario1_firstCall]
   
   Expected: {"results": [{"status": "ok", "stored": true}]}

### Test 2: Second Call (Update Existing)
1. Call check-ticket again with same phone
   Expected: {"has_existing": true, "ticket_id": "...", "summary": "..."}

2. Call webhook with existing_ticket_id
   Expected: {"results": [{"status": "ok", "updated": true}]}

3. Verify in Supabase that issue_details contains both original and update

### Test 3: Second Call (New Ticket)
1. Call check-ticket (should still find existing)
2. Call webhook WITHOUT existing_ticket_id
   Expected: New ticket created

### Test 4: Email Verification
1. Check that emails have correct prefixes:
   - [NEW] for new tickets
   - [UPDATE] for updates

## Database Verification Queries

-- Check ticket updates
SELECT ticket_id, issue_summary, issue_details, created_at, updated_at 
FROM tickets 
WHERE caller_phone = '+491701234567'
ORDER BY created_at DESC;

-- Check open tickets for phone
SELECT ticket_id, issue_summary, status, created_at
FROM tickets 
WHERE caller_phone = '+491701234567' 
AND status IN ('NEW', 'IN_PROGRESS')
ORDER BY created_at DESC;
`;

// Automated Test Helper Functions
export class DuplicatePreventionTester {
  private baseUrl: string;
  private secret: string;

  constructor(baseUrl = 'http://localhost:3000', secret = 'test_secret') {
    this.baseUrl = baseUrl;
    this.secret = secret;
  }

  async checkExistingTicket(callerPhone: string) {
    const response = await fetch(\`\${this.baseUrl}/api/vapi/check-ticket\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-vapi-secret': this.secret
      },
      body: JSON.stringify({ caller_phone: callerPhone })
    });
    return response.json();
  }

  async submitTicket(payload: any) {
    const vapiMessage = {
      message: {
        type: "tool-calls",
        toolCallList: [{
          id: "test_tool_call",
          name: "submit_ticket",
          parameters: payload
        }],
        call: { id: payload.call_id }
      }
    };

    const response = await fetch(\`\${this.baseUrl}/api/vapi/webhook\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-vapi-secret': this.secret
      },
      body: JSON.stringify(vapiMessage)
    });
    return response.json();
  }

  async runScenario1() {
    console.log('Running Scenario 1: First Call');
    
    const checkResult = await this.checkExistingTicket(TEST_PHONE);
    console.log('Check result:', checkResult);
    
    const submitResult = await this.submitTicket(testScenarios.scenario1_firstCall.steps[1].payload);
    console.log('Submit result:', submitResult);
    
    return { checkResult, submitResult };
  }

  // Add more scenario methods as needed...
}

export default {
  testScenarios,
  manualTestInstructions,
  DuplicatePreventionTester
};