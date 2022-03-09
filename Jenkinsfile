pipeline {
    agent any
    environment {
        IMAGE_NAME = 'xfs-network/xfswallet-chrome'
     }
    stages {
        stage('BuildAndRelease') {
            when {
                branch 'main'
            }
            steps {
                script {
                    dockerImage = docker.build("${IMAGE_NAME}")
                    dockerImage.withRun(){
                        sh 'echo abc'
                    }
                }
            }
        }
    }
}