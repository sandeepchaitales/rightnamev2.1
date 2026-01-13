#!/usr/bin/env python3
"""
Test NICE class mapping directly
"""

import sys
sys.path.append('/app/backend')

# Import the function from server.py
from server import get_nice_classification

def test_nice_mapping():
    print("🔍 Testing NICE Class Mapping Function")
    print("="*50)
    
    test_cases = [
        ("Cleaning solutions", 3),
        ("cleaning", 3),
        ("Finance/Payments", 36),
        ("finance", 36),
        ("Fashion", 25),
        ("Technology", 35),  # Default
    ]
    
    for category, expected_class in test_cases:
        result = get_nice_classification(category)
        actual_class = result.get("class_number")
        
        status = "✅ PASS" if actual_class == expected_class else "❌ FAIL"
        print(f"{status} '{category}' → Class {actual_class} (expected {expected_class})")
        print(f"     Description: {result.get('class_description', 'N/A')}")
        print(f"     Matched Term: {result.get('matched_term', 'N/A')}")
        print()

if __name__ == "__main__":
    test_nice_mapping()