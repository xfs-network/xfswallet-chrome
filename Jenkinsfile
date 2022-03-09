pipeline {
    agent any
    environment {
    }
    stages {
        stage('BuildAndRelease') {
            when {
                branch 'main'
            }
            steps {
                script {
                    sh 'echo hello'
                }
            }
        }
    }
}