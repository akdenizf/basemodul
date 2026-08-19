import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const repoRoot = path.resolve(import.meta.dirname, '../..');
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
const exists = (relativePath) => fs.existsSync(path.join(repoRoot, relativePath));
const failures = [];
const checks = [];

function requireFile(relativePath) {
  if (!exists(relativePath)) {
    failures.push(`Fehlende Pflichtdatei: ${relativePath}`);
    return '';
  }
  checks.push(`Datei vorhanden: ${relativePath}`);
  return read(relativePath);
}

function requireText(text, label, pattern) {
  if (!pattern.test(text)) {
    failures.push(`Fehlende Regel in ${label}: ${pattern}`);
  } else {
    checks.push(`Regel vorhanden: ${label} → ${pattern}`);
  }
}

const protocol = requireFile('outreach/HERMES_DRY_RUN_PROTOCOL.md');
const agentSpec = requireFile('outreach/OUTREACH_SPECIALIST.md');
const pilotKnowledge = requireFile('outreach/knowledge-base/PILOT_OFFER_KNOWLEDGE.md');
const qualityGates = requireFile('outreach/QUALITY_GATES.md');
const fixturePath = 'outreach/fixtures/hermes_dry_run_shk_fixture.json';
const fixtureRaw = requireFile(fixturePath);

let fixture;
try {
  fixture = JSON.parse(fixtureRaw);
  checks.push(`Synthetischer Testfall lesbar: ${fixturePath}`);
} catch (error) {
  failures.push(`Ungültiges JSON in ${fixturePath}: ${error.message}`);
}

requireText(protocol, 'Dry-Run-Protokoll', /keine Leads/i);
requireText(protocol, 'Dry-Run-Protokoll', /keine.*versend/i);
requireText(agentSpec, 'Agentenspezifikation', /Kein Versand/i);
requireText(agentSpec, 'Agentenspezifikation', /Keine Lead-Dateien/i);
requireText(agentSpec, 'Agentenspezifikation', /menschlich(?:er|en|em)? Review/i);
requireText(pilotKnowledge, 'Pilotwissen', /human_review_required/i);
requireText(pilotKnowledge, 'Pilotwissen', /Preis.*(?:Erstkontakt|nicht)|Kein(?:e|en)? Preis/i);
requireText(qualityGates, 'Quality Gates', /Hard Blocks/i);
requireText(qualityGates, 'Quality Gates', /DSGVO-konform/i);
requireText(qualityGates, 'Quality Gates', /Ein Entwurf erreicht.*nie.*send_allowed/i);

if (fixture) {
  if (fixture.synthetic !== true || fixture.company_is_fictional !== true) {
    failures.push('Fixture muss vollständig synthetisch und als fiktiv markiert sein.');
  } else {
    checks.push('Fixture ist als vollständig synthetisch markiert.');
  }

  const forbiddenJoined = Array.isArray(fixture.forbidden_output) ? fixture.forbidden_output.join(' ').toLowerCase() : '';
  for (const requiredBlock of ['email sending', 'lead record creation', 'price or tariff']) {
    if (!forbiddenJoined.includes(requiredBlock)) {
      failures.push(`Fixture blockiert nicht explizit: ${requiredBlock}`);
    } else {
      checks.push(`Fixture blockiert: ${requiredBlock}`);
    }
  }

  if (fixture.required_output_status !== 'human_review_required') {
    failures.push('Fixture muss human_review_required als Endstatus verlangen.');
  } else {
    checks.push('Fixture verlangt human_review_required.');
  }
}

console.log('Hermes Dry Run — BaseModule');
console.log('Mode: static validation only; no leads, no sends, no external calls.');
console.log('');
for (const check of checks) console.log(`PASS  ${check}`);
for (const failure of failures) console.log(`FAIL  ${failure}`);
console.log('');

if (failures.length > 0) {
  console.error(`DRY_RUN_BLOCKED: ${failures.length} Prüfpunkt(e) fehlgeschlagen.`);
  process.exit(1);
}

console.log('DRY_RUN_READY: Alle statischen Safety- und Quellen-Gates erfüllt.');
