pipeline {
    agent any
    environment {
        IMAGE_NAME = 'xfs-network/xfswallet-chrome'
     }
    stages {
        stage('Build') {
            when {
                branch 'main'
            }
            steps {
                script {
                    dockerImage = docker.build("${IMAGE_NAME}")
                    sh 'echo ${dockerImage.imageName()}'
                }
            }
        }
        stage('Release') {
            when {
                branch 'main'
            }
            steps {
                script {
                    sh 'ls -al'
                }
            }
        }
    }
}