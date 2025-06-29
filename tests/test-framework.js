// Simple test framework for gPacMan

class TestFramework {
    constructor() {
        this.testSuites = new Map();
        this.currentSuite = null;
        this.totalTests = 0;
        this.passedTests = 0;
        this.failedTests = 0;
    }
    
    suite(name) {
        this.currentSuite = {
            name: name,
            tests: [],
            beforeEach: null,
            afterEach: null
        };
        this.testSuites.set(name, this.currentSuite);
        return this;
    }
    
    beforeEach(fn) {
        if (this.currentSuite) {
            this.currentSuite.beforeEach = fn;
        }
        return this;
    }
    
    afterEach(fn) {
        if (this.currentSuite) {
            this.currentSuite.afterEach = fn;
        }
        return this;
    }
    
    test(description, testFn) {
        if (this.currentSuite) {
            this.currentSuite.tests.push({
                description: description,
                fn: testFn,
                passed: false,
                error: null
            });
        }
        return this;
    }
    
    async runSuite(suiteName) {
        const suite = this.testSuites.get(suiteName);
        if (!suite) return;
        
        console.log(`Running test suite: ${suiteName}`);
        
        for (const test of suite.tests) {
            try {
                // Run beforeEach if it exists
                if (suite.beforeEach) {
                    await suite.beforeEach();
                }
                
                // Run the test
                await test.fn();
                test.passed = true;
                this.passedTests++;
                
                // Run afterEach if it exists
                if (suite.afterEach) {
                    await suite.afterEach();
                }
                
            } catch (error) {
                test.passed = false;
                test.error = error;
                this.failedTests++;
                console.error(`Test failed: ${test.description}`, error);
            }
            
            this.totalTests++;
        }
    }
    
    async runAllTests() {
        this.totalTests = 0;
        this.passedTests = 0;
        this.failedTests = 0;
        
        console.log('Running all tests...');
        
        for (const suiteName of this.testSuites.keys()) {
            await this.runSuite(suiteName);
        }
        
        this.displayResults();
        return this.failedTests === 0;
    }
    
    displayResults() {
        const resultsContainer = document.getElementById('test-results');
        let html = '';
        
        // Display results for each suite
        for (const [suiteName, suite] of this.testSuites.entries()) {
            html += `<div class="test-suite">`;
            html += `<h3>${suiteName}</h3>`;
            
            for (const test of suite.tests) {
                const cssClass = test.passed ? 'test-pass' : 'test-fail';
                const status = test.passed ? '✓ PASS' : '✗ FAIL';
                const errorMsg = test.error ? ` - ${test.error.message}` : '';
                
                html += `<div class="test-case ${cssClass}">`;
                html += `${status}: ${test.description}${errorMsg}`;
                html += `</div>`;
            }
            
            html += `</div>`;
        }
        
        // Add summary
        const allPassed = this.failedTests === 0;
        const summaryClass = allPassed ? 'summary-pass' : 'summary-fail';
        const summaryText = allPassed ? 'ALL TESTS PASSED!' : 'SOME TESTS FAILED!';
        
        html += `<div class="test-summary ${summaryClass}">`;
        html += `${summaryText}<br>`;
        html += `Passed: ${this.passedTests} | Failed: ${this.failedTests} | Total: ${this.totalTests}`;
        html += `</div>`;
        
        resultsContainer.innerHTML = html;
    }
}

// Assertion functions
const assert = {
    equals(actual, expected, message = '') {
        if (actual !== expected) {
            throw new Error(`Assertion failed: Expected ${expected}, got ${actual}. ${message}`);
        }
    },
    
    true(value, message = '') {
        if (value !== true) {
            throw new Error(`Assertion failed: Expected true, got ${value}. ${message}`);
        }
    },
    
    false(value, message = '') {
        if (value !== false) {
            throw new Error(`Assertion failed: Expected false, got ${value}. ${message}`);
        }
    },
    
    notNull(value, message = '') {
        if (value === null || value === undefined) {
            throw new Error(`Assertion failed: Expected non-null value, got ${value}. ${message}`);
        }
    },
    
    throws(fn, message = '') {
        let threw = false;
        try {
            fn();
        } catch (e) {
            threw = true;
        }
        if (!threw) {
            throw new Error(`Assertion failed: Expected function to throw. ${message}`);
        }
    },
    
    approximately(actual, expected, tolerance = 0.001, message = '') {
        if (Math.abs(actual - expected) > tolerance) {
            throw new Error(`Assertion failed: Expected ${expected} ± ${tolerance}, got ${actual}. ${message}`);
        }
    },
    
    arrayEquals(actual, expected, message = '') {
        if (!Array.isArray(actual) || !Array.isArray(expected)) {
            throw new Error(`Assertion failed: Both values must be arrays. ${message}`);
        }
        if (actual.length !== expected.length) {
            throw new Error(`Assertion failed: Arrays have different lengths. ${message}`);
        }
        for (let i = 0; i < actual.length; i++) {
            if (actual[i] !== expected[i]) {
                throw new Error(`Assertion failed: Arrays differ at index ${i}. ${message}`);
            }
        }
    }
};

// Global test runner instance
const TestRunner = new TestFramework();