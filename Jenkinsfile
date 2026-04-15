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

                echo 'Installing dependencies for study-planner-client'

                // Navigate into the client directory
                dir('study-planner-client') {
                    // Install Node.js dependencies for frontend
                    bat 'npm install'
                }
            }
        }
    }
}