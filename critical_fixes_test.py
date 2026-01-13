#!/usr/bin/env python3
"""
CRITICAL FIXES TESTING for RIGHTNAME Brand Evaluation API
Testing the two critical fixes implemented:
1. Cleevo Brand Detection (Should be REJECTED)
2. NICE Class for Cleaning Solutions (Should be Class 3)
3. NICE Class for Finance/Payments (Should be Class 36)
"""

import requests
import sys
import json
import time
from datetime import datetime

class CriticalFixesTester:
    def __init__(self, base_url="https://namevalidator-app.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })

    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*80)
        print("📊 CRITICAL FIXES TEST SUMMARY")
        print("="*80)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%" if self.tests_run > 0 else "0%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 ALL CRITICAL FIXES WORKING!")
        else:
            print(f"\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['details']}")
        
        return self.tests_passed == self.tests_run

    def test_cleevo_brand_detection(self):
        """Test Case 1: Cleevo Brand Detection (Should be REJECTED)"""
        payload = {
            "brand_names": ["Cleevo"],
            "category": "Cleaning solutions",
            "positioning": "Premium",
            "market_scope": "Single Country",
            "countries": ["India"]
        }
        
        try:
            print(f"\n🧽 CRITICAL FIX TEST 1: Cleevo Brand Detection...")
            print(f"Expected: REJECT verdict, Low NameScore (~5), 'EXISTING BRAND' or 'FATAL CONFLICT' in summary")
            print(f"Reason: Cleevo is existing cleaning products brand (getcleevo.com, JioMart, Flipkart, BigBasket)")
            
            # Use async polling endpoint as specified
            start_response = requests.post(
                f"{self.api_url}/evaluate/start", 
                json=payload, 
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            print(f"Start Response Status: {start_response.status_code}")
            
            if start_response.status_code != 200:
                error_msg = f"HTTP {start_response.status_code}: {start_response.text[:300]}"
                self.log_test("Cleevo Brand Detection - Start Request", False, error_msg)
                return False
            
            start_data = start_response.json()
            if "job_id" not in start_data:
                self.log_test("Cleevo Brand Detection - Job ID", False, "No job_id in start response")
                return False
            
            job_id = start_data["job_id"]
            print(f"Job ID: {job_id}")
            
            # Poll for results (60-120 seconds as mentioned in review)
            max_wait_time = 120
            poll_interval = 5
            start_time = time.time()
            
            while time.time() - start_time < max_wait_time:
                status_response = requests.get(
                    f"{self.api_url}/evaluate/status/{job_id}",
                    timeout=10
                )
                
                if status_response.status_code == 200:
                    status_data = status_response.json()
                    
                    if status_data.get("status") == "completed":
                        print(f"✅ Job completed in {time.time() - start_time:.2f} seconds")
                        
                        # Check the results
                        if "result" not in status_data:
                            self.log_test("Cleevo Brand Detection - Result Missing", False, "No result in completed job")
                            return False
                        
                        data = status_data["result"]
                        
                        # Verify structure
                        if not data.get("brand_scores") or len(data["brand_scores"]) == 0:
                            self.log_test("Cleevo Brand Detection - Structure", False, "No brand scores returned")
                            return False
                        
                        brand = data["brand_scores"][0]
                        
                        # Test 1: Check verdict is REJECT
                        verdict = brand.get("verdict", "")
                        if verdict != "REJECT":
                            self.log_test("Cleevo Brand Detection - Verdict", False, f"Expected REJECT, got {verdict}")
                            return False
                        
                        # Test 2: Check NameScore is low (around 5)
                        namescore = brand.get("namescore", 0)
                        if namescore > 15:  # Should be very low for existing brand
                            self.log_test("Cleevo Brand Detection - NameScore", False, f"Expected low score (~5), got {namescore}")
                            return False
                        
                        # Test 3: Check summary mentions existing brand or conflict
                        summary = brand.get("summary", "").lower()
                        conflict_indicators = ["existing brand", "fatal conflict", "already exists", "conflict detected", "verified conflict"]
                        
                        if not any(indicator in summary for indicator in conflict_indicators):
                            self.log_test("Cleevo Brand Detection - Conflict Indicators", False, f"Summary should mention existing brand conflict. Got: {summary[:200]}")
                            return False
                        
                        print(f"✅ Cleevo correctly detected as existing brand:")
                        print(f"   - Verdict: {verdict}")
                        print(f"   - NameScore: {namescore}")
                        print(f"   - Summary contains conflict indicators")
                        
                        self.log_test("Cleevo Brand Detection - CRITICAL FIX", True, 
                                    f"Cleevo correctly REJECTED. Verdict: {verdict}, NameScore: {namescore}, Conflict detected in summary")
                        return True
                    
                    elif status_data.get("status") == "failed":
                        error_msg = status_data.get("error", "Unknown error")
                        self.log_test("Cleevo Brand Detection - Job Failed", False, f"Job failed: {error_msg}")
                        return False
                    
                    else:
                        print(f"⏳ Job status: {status_data.get('status')}, waiting...")
                        time.sleep(poll_interval)
                
                else:
                    print(f"⚠️ Status check failed: {status_response.status_code}")
                    time.sleep(poll_interval)
            
            self.log_test("Cleevo Brand Detection - Timeout", False, f"Job did not complete within {max_wait_time} seconds")
            return False
                
        except Exception as e:
            self.log_test("Cleevo Brand Detection - Exception", False, str(e))
            return False

    def test_nice_class_cleaning_solutions(self):
        """Test Case 2: NICE Class for Cleaning Solutions (Should be Class 3)"""
        payload = {
            "brand_names": ["UniqueClean2025"],
            "category": "Cleaning solutions",
            "positioning": "Premium",
            "market_scope": "Single Country",
            "countries": ["India"]
        }
        
        try:
            print(f"\n🏷️ CRITICAL FIX TEST 2: NICE Class for Cleaning Solutions...")
            print(f"Expected: GO verdict, Class 3 (Cleaning preparations), NOT Class 25 (Fashion)")
            
            # Use async polling endpoint
            start_response = requests.post(
                f"{self.api_url}/evaluate/start", 
                json=payload, 
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            print(f"Start Response Status: {start_response.status_code}")
            
            if start_response.status_code != 200:
                error_msg = f"HTTP {start_response.status_code}: {start_response.text[:300]}"
                self.log_test("NICE Class Cleaning - Start Request", False, error_msg)
                return False
            
            start_data = start_response.json()
            if "job_id" not in start_data:
                self.log_test("NICE Class Cleaning - Job ID", False, "No job_id in start response")
                return False
            
            job_id = start_data["job_id"]
            print(f"Job ID: {job_id}")
            
            # Poll for results
            max_wait_time = 120
            poll_interval = 5
            start_time = time.time()
            
            while time.time() - start_time < max_wait_time:
                status_response = requests.get(
                    f"{self.api_url}/evaluate/status/{job_id}",
                    timeout=10
                )
                
                if status_response.status_code == 200:
                    status_data = status_response.json()
                    
                    if status_data.get("status") == "completed":
                        print(f"✅ Job completed in {time.time() - start_time:.2f} seconds")
                        
                        # Check the results
                        if "result" not in status_data:
                            self.log_test("NICE Class Cleaning - Result Missing", False, "No result in completed job")
                            return False
                        
                        data = status_data["result"]
                        
                        # Verify structure
                        if not data.get("brand_scores") or len(data["brand_scores"]) == 0:
                            self.log_test("NICE Class Cleaning - Structure", False, "No brand scores returned")
                            return False
                        
                        brand = data["brand_scores"][0]
                        
                        # Test 1: Check verdict is GO (unique brand should pass)
                        verdict = brand.get("verdict", "")
                        if verdict not in ["GO", "APPROVE"]:
                            self.log_test("NICE Class Cleaning - Verdict", False, f"Expected GO/APPROVE for unique brand, got {verdict}")
                            return False
                        
                        # Test 2: Check trademark_research exists
                        if "trademark_research" not in brand:
                            self.log_test("NICE Class Cleaning - Trademark Research", False, "trademark_research field missing")
                            return False
                        
                        tm_research = brand["trademark_research"]
                        if not tm_research:
                            self.log_test("NICE Class Cleaning - Trademark Data", False, "trademark_research is null/empty")
                            return False
                        
                        # Test 3: Check NICE Classification is Class 3
                        nice_class = tm_research.get("nice_classification", {})
                        if not nice_class:
                            self.log_test("NICE Class Cleaning - Classification Missing", False, "nice_classification field missing")
                            return False
                        
                        class_number = nice_class.get("class_number")
                        if class_number != 3:
                            self.log_test("NICE Class Cleaning - Wrong Class", False, f"Expected Class 3 for cleaning solutions, got Class {class_number}")
                            return False
                        
                        # Test 4: Check class description contains "Cleaning"
                        class_description = nice_class.get("class_description", "")
                        if "cleaning" not in class_description.lower():
                            self.log_test("NICE Class Cleaning - Description", False, f"Class description should contain 'Cleaning', got: {class_description}")
                            return False
                        
                        print(f"✅ NICE Class correctly assigned:")
                        print(f"   - Verdict: {verdict}")
                        print(f"   - Class Number: {class_number}")
                        print(f"   - Class Description: {class_description}")
                        
                        self.log_test("NICE Class Cleaning Solutions - CRITICAL FIX", True, 
                                    f"Cleaning solutions correctly mapped to Class 3. Verdict: {verdict}, Class: {class_number}")
                        return True
                    
                    elif status_data.get("status") == "failed":
                        error_msg = status_data.get("error", "Unknown error")
                        self.log_test("NICE Class Cleaning - Job Failed", False, f"Job failed: {error_msg}")
                        return False
                    
                    else:
                        print(f"⏳ Job status: {status_data.get('status')}, waiting...")
                        time.sleep(poll_interval)
                
                else:
                    print(f"⚠️ Status check failed: {status_response.status_code}")
                    time.sleep(poll_interval)
            
            self.log_test("NICE Class Cleaning - Timeout", False, f"Job did not complete within {max_wait_time} seconds")
            return False
                
        except Exception as e:
            self.log_test("NICE Class Cleaning - Exception", False, str(e))
            return False

    def test_nice_class_finance_payments(self):
        """Test Case 3: Unique Brand in Different Category (Finance) - Should be Class 36"""
        payload = {
            "brand_names": ["FinoPayX2025"],
            "category": "Finance/Payments",
            "positioning": "Premium",
            "market_scope": "Single Country",
            "countries": ["India"]
        }
        
        try:
            print(f"\n💰 CRITICAL FIX TEST 3: NICE Class for Finance/Payments...")
            print(f"Expected: GO/CAUTION verdict, Class 36 (Insurance, financial affairs, banking)")
            
            # Use async polling endpoint
            start_response = requests.post(
                f"{self.api_url}/evaluate/start", 
                json=payload, 
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            print(f"Start Response Status: {start_response.status_code}")
            
            if start_response.status_code != 200:
                error_msg = f"HTTP {start_response.status_code}: {start_response.text[:300]}"
                self.log_test("NICE Class Finance - Start Request", False, error_msg)
                return False
            
            start_data = start_response.json()
            if "job_id" not in start_data:
                self.log_test("NICE Class Finance - Job ID", False, "No job_id in start response")
                return False
            
            job_id = start_data["job_id"]
            print(f"Job ID: {job_id}")
            
            # Poll for results
            max_wait_time = 120
            poll_interval = 5
            start_time = time.time()
            
            while time.time() - start_time < max_wait_time:
                status_response = requests.get(
                    f"{self.api_url}/evaluate/status/{job_id}",
                    timeout=10
                )
                
                if status_response.status_code == 200:
                    status_data = status_response.json()
                    
                    if status_data.get("status") == "completed":
                        print(f"✅ Job completed in {time.time() - start_time:.2f} seconds")
                        
                        # Check the results
                        if "result" not in status_data:
                            self.log_test("NICE Class Finance - Result Missing", False, "No result in completed job")
                            return False
                        
                        data = status_data["result"]
                        
                        # Verify structure
                        if not data.get("brand_scores") or len(data["brand_scores"]) == 0:
                            self.log_test("NICE Class Finance - Structure", False, "No brand scores returned")
                            return False
                        
                        brand = data["brand_scores"][0]
                        
                        # Test 1: Check verdict is GO or CAUTION
                        verdict = brand.get("verdict", "")
                        if verdict not in ["GO", "APPROVE", "CAUTION"]:
                            self.log_test("NICE Class Finance - Verdict", False, f"Expected GO/APPROVE/CAUTION for unique brand, got {verdict}")
                            return False
                        
                        # Test 2: Check trademark_research exists
                        if "trademark_research" not in brand:
                            self.log_test("NICE Class Finance - Trademark Research", False, "trademark_research field missing")
                            return False
                        
                        tm_research = brand["trademark_research"]
                        if not tm_research:
                            self.log_test("NICE Class Finance - Trademark Data", False, "trademark_research is null/empty")
                            return False
                        
                        # Test 3: Check NICE Classification is Class 36
                        nice_class = tm_research.get("nice_classification", {})
                        if not nice_class:
                            self.log_test("NICE Class Finance - Classification Missing", False, "nice_classification field missing")
                            return False
                        
                        class_number = nice_class.get("class_number")
                        if class_number != 36:
                            self.log_test("NICE Class Finance - Wrong Class", False, f"Expected Class 36 for Finance/Payments, got Class {class_number}")
                            return False
                        
                        # Test 4: Check class description contains finance-related terms
                        class_description = nice_class.get("class_description", "").lower()
                        finance_terms = ["insurance", "financial", "banking", "payment"]
                        
                        if not any(term in class_description for term in finance_terms):
                            self.log_test("NICE Class Finance - Description", False, f"Class description should contain finance terms, got: {class_description}")
                            return False
                        
                        print(f"✅ NICE Class correctly assigned for Finance:")
                        print(f"   - Verdict: {verdict}")
                        print(f"   - Class Number: {class_number}")
                        print(f"   - Class Description: {nice_class.get('class_description', '')}")
                        
                        self.log_test("NICE Class Finance/Payments - CRITICAL FIX", True, 
                                    f"Finance/Payments correctly mapped to Class 36. Verdict: {verdict}, Class: {class_number}")
                        return True
                    
                    elif status_data.get("status") == "failed":
                        error_msg = status_data.get("error", "Unknown error")
                        self.log_test("NICE Class Finance - Job Failed", False, f"Job failed: {error_msg}")
                        return False
                    
                    else:
                        print(f"⏳ Job status: {status_data.get('status')}, waiting...")
                        time.sleep(poll_interval)
                
                else:
                    print(f"⚠️ Status check failed: {status_response.status_code}")
                    time.sleep(poll_interval)
            
            self.log_test("NICE Class Finance - Timeout", False, f"Job did not complete within {max_wait_time} seconds")
            return False
                
        except Exception as e:
            self.log_test("NICE Class Finance - Exception", False, str(e))
            return False

    def check_backend_logs(self):
        """Check backend logs for NICE CLASS FIX and VERIFIED CONFLICT messages"""
        try:
            print(f"\n📋 Checking backend logs for fix indicators...")
            
            # Check supervisor logs for backend
            import subprocess
            result = subprocess.run(
                ["tail", "-n", "100", "/var/log/supervisor/backend.out.log"],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if result.returncode == 0:
                logs = result.stdout
                
                # Look for NICE CLASS FIX messages
                nice_fix_found = "NICE CLASS FIX" in logs
                verified_conflict_found = "VERIFIED CONFLICT" in logs
                
                print(f"   - NICE CLASS FIX messages: {'✅ Found' if nice_fix_found else '❌ Not found'}")
                print(f"   - VERIFIED CONFLICT messages: {'✅ Found' if verified_conflict_found else '❌ Not found'}")
                
                if nice_fix_found or verified_conflict_found:
                    self.log_test("Backend Logs - Fix Indicators", True, "Found expected fix indicators in logs")
                    return True
                else:
                    self.log_test("Backend Logs - Fix Indicators", False, "Expected fix indicators not found in logs")
                    return False
            else:
                self.log_test("Backend Logs - Access", False, "Could not access backend logs")
                return False
                
        except Exception as e:
            self.log_test("Backend Logs - Exception", False, str(e))
            return False

    def run_critical_fixes_tests(self):
        """Run all critical fixes tests"""
        print("🔥 CRITICAL FIXES TESTING - RIGHTNAME Brand Evaluation API")
        print("="*80)
        print("Testing two critical fixes implemented:")
        print("1. Cleevo Brand Detection (Should be REJECTED)")
        print("2. NICE Class for Cleaning Solutions (Should be Class 3)")
        print("3. NICE Class for Finance/Payments (Should be Class 36)")
        print("="*80)
        
        # Run the three critical tests
        self.test_cleevo_brand_detection()
        self.test_nice_class_cleaning_solutions()
        self.test_nice_class_finance_payments()
        
        # Check backend logs for fix indicators
        self.check_backend_logs()
        
        return self.print_summary()

if __name__ == "__main__":
    tester = CriticalFixesTester()
    success = tester.run_critical_fixes_tests()
    sys.exit(0 if success else 1)