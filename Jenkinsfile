pipeline {
    agent any
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