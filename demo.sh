#!/bin/bash

echo "🎯 ReadmeRanker Comprehensive Demo"
echo "==================================="
echo

echo "1️⃣ Testing local README analysis..."
echo "------------------------------------"
node dist/bin/readmeranker.js . --verbose
echo

echo "2️⃣ Testing JSON output format..."
echo "---------------------------------"
node dist/bin/readmeranker.js . --json
echo

echo "3️⃣ Testing AI-enhanced suggestions..."
echo "--------------------------------------"
node dist/bin/readmeranker.js . --ai
echo

echo "4️⃣ Testing remote repository analysis..."
echo "----------------------------------------"
node dist/bin/readmeranker.js facebook/react --ai
echo

echo "5️⃣ Testing validation command..."
echo "---------------------------------"
node dist/bin/readmeranker.js validate . --strict
echo

echo "6️⃣ Testing configuration commands..."
echo "-------------------------------------"
node dist/bin/readmeranker.js config show
echo

echo "✅ Demo Complete!"
echo "================="
echo "ReadmeRanker is ready for use! 🚀"
