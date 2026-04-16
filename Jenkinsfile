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

        // Stage 3: SonarQube static code analysis
        stage('SonarQube Analysis') {
            steps {
                echo 'Running SonarQube static code analysis'

                withSonarQubeEnv('My SonarQube Server') {
                    bat '''
                        sonar-scanner ^
                        -Dsonar.projectKey=comp367-study-planner ^
                        -Dsonar.projectName=comp367-study-planner ^
                        -Dsonar.sources=server,study-planner-client
                    '''
                }
            }
        }

        // Stage 4: Test stage to execute test commands and show code coverage output
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

        // Stage 5: Deliver stage (build production artifacts)
        stage('Deliver') {
            steps {
                echo 'Building production artifacts for server and client'

                dir('server') {
                    bat 'npm run build || echo "No server build script configured"'
                }

                dir('study-planner-client') {
                    bat 'npm run build || echo "No client build script configured"'
                }
            }
        }

        // Stage 6: Deploy to Dev environment (mocked)
        stage('Deploy to Dev') {
            steps {
                echo 'Deploying application to Dev environment (mocked deploy)'
            }
        }

        // Stage 7: Deploy to QAT environment (mocked)
        stage('Deploy to QAT') {
            steps {
                echo 'Deploying application to QAT environment (mocked deploy)'
            }
        }

        // Stage 8: Deploy to Staging environment (mocked)
        stage('Deploy to Staging') {
            steps {
                echo 'Deploying application to Staging environment (mocked deploy)'
            }
        }

        // Stage 9: Deploy to Production environment (mocked)
        stage('Deploy to Production') {
            steps {
                echo 'Deploying application to Production environment (mocked deploy)'
            }
        }
    }
}
