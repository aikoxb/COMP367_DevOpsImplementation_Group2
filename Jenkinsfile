// COMP367_DevOpsImplementation_Group2/Jenkinsfile
// Jenkins pipeline definition
pipeline {
    
    // Pipeline can run on any available Jenkins agent
    agent any

    // Automatically triggers the pipeline by polling source control
    triggers {
        // Checks for changes every minute (for demo purposes)
        pollSCM('* * * * *')
    }

    stages {

        // Stage 1: Checkout source code from GitHub repository
        stage('Checkout') {
            steps {
                echo 'Checking out source code from GitHub'
                
                // Retrieve the latest code from the connected Git repository
                checkout scm
            }
        }

        // Stage 2: Build stage (install dependencies for both backend and frontend)
        stage('Build') {
            steps {
                echo 'Installing dependencies for server'

                // Navigate into the server directory
                dir('server') {
                    // Install Node.js dependencies for backend
                    bat 'npm install'
                }

                echo 'Installing dependencies for client'

                // Navigate into the client directory
                dir('study-planner-client') {
                    // Install Node.js dependencies for frontend
                    bat 'npm install'
                }
            }
        }

        // Stage 3: Test stage to execute test commands and show code coverage output
        stage('Test') {
            steps {
                echo 'Running tests for server'

                // Navigate into the server directory
                dir('server') {
                    // Run the server test command
                    bat 'npm test'

                    // Display the generated coverage report
                    echo 'Coverage report for server:'
                    bat 'type coverage\\coverage.txt'
                }

                echo 'Running tests for client'

                // Navigate into the client directory
                dir('study-planner-client') {
                    // Run the client test command
                    bat 'npm test'
                    // Display the generated coverage report
                    echo 'Coverage report for client:'
                    bat 'type coverage\\coverage.txt'
                }
            }
        }
    }
}