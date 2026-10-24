#!/bin/bash
# Easy start for tools/make-audio-azure.sh: asks for the Azure key (hidden) and keeps a log.
#   bash tools/run-azure.sh
cd "$(dirname "$0")/.."
read -r -s -p "Azure KEY 1 (не відображається): " AZURE_SPEECH_KEY; echo
read -r -p "Регіон [northeurope]: " AZURE_SPEECH_REGION
AZURE_SPEECH_KEY="$(printf %s "$AZURE_SPEECH_KEY" | tr -d '[:space:]')"
export AZURE_SPEECH_KEY AZURE_SPEECH_REGION="${AZURE_SPEECH_REGION:-northeurope}"
caffeinate -i bash tools/make-audio-azure.sh 2>&1 | tee -a audio/nl/.azure-log
