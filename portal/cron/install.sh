#!/usr/bin/env bash

set -Eeuo pipefail

APP="${HOME}/novaris-app"
SCRIPT="${APP}/portal/cron/send-reminders.php"
LOG_DIR="${HOME}/logs"
LOG_FILE="${LOG_DIR}/meeting-reminders.log"
MARKER="# novaris-meeting-reminders"
JOB="*/5 * * * * /usr/bin/php ${SCRIPT} >> ${LOG_FILE} 2>&1 ${MARKER}"

if [[ ! -f "${SCRIPT}" ]]; then
  echo "Greška: nije pronađena cron skripta ${SCRIPT}" >&2
  exit 1
fi

mkdir -p "${LOG_DIR}"
touch "${LOG_FILE}"

current_crontab="$(crontab -l 2>/dev/null || true)"
filtered_crontab="$(printf '%s\n' "${current_crontab}" | grep -vF "${MARKER}" || true)"

{
  printf '%s\n' "${filtered_crontab}"
  printf '%s\n' "${JOB}"
} | sed '/^[[:space:]]*$/d' | crontab -

echo "✓ Cron za podsjetnike instaliran je svakih 5 minuta."
echo "  Log: ${LOG_FILE}"
