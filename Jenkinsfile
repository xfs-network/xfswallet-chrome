pipeline {
    agent any
    environment {
        IMAGE_NAME = 'xfs-network/xfswallet-chrome'
     }
    stages {
        stage('Build') {
            when {
                branch 'develop'
            }
            steps {
                script {
                    dockerImage = docker.build("${IMAGE_NAME}")
                    dockerImage.withRun(){ c ->
                        sh "docker cp ${c.id}:/var/cache/nodejs/dist ./"
                    }
                }
            }
        }
        stage('Release') {
            when {
                branch 'develop'
            }
            steps {
                script {
                    sh 'zip -r -j dist.zip dist'
                    json_file = env.WORKSPACE + "/public/manifest.json"
                    def jsonObj = readJSON file: json_file
                    echo jsonObj
                }
            }
        }
    }
}