pipeline {
    agent any
    triggers { pollSCM('H/5 * * * *') }
    environment {
        IMAGE_SERVER = 'sirineraies/interconnect-copie-server'
        IMAGE_CLIENT = 'sirineraies/interconnect-copie-client'
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                url: 'https://github.com/SirineRaies/InterConnect.git'
            }
        }

        stage('Build + Push SERVER') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'DH_USER',
                    passwordVariable: 'DH_PASS'
                )]) {
                    sh '''
                    echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
                    docker build -t $IMAGE_SERVER:${BUILD_NUMBER} ./backend
                    docker push $IMAGE_SERVER:${BUILD_NUMBER}
                    '''
                }
            }
        }

        stage('Build + Push CLIENT') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'DH_USER',
                    passwordVariable: 'DH_PASS'
                )]) {
                    sh '''
                    echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
                    docker build -t $IMAGE_CLIENT:${BUILD_NUMBER} ./frontend
                    docker push $IMAGE_CLIENT:${BUILD_NUMBER}
                    '''
                }
            }
        }

        stage('Security Scan - Trivy') {
            steps {
                sh '''
                echo "Scanning SERVER image..."
                docker run --rm \
                -v /var/run/docker.sock:/var/run/docker.sock \
                aquasec/trivy \
                image --severity CRITICAL,HIGH \
                --timeout 10m \
                --exit-code 0 \
                $IMAGE_SERVER:${BUILD_NUMBER}

                echo "Scanning CLIENT image..."
                docker run --rm \
                -v /var/run/docker.sock:/var/run/docker.sock \
                aquasec/trivy \
                image --severity CRITICAL,HIGH \
                --timeout 10m \
                --exit-code 0 \
                $IMAGE_CLIENT:${BUILD_NUMBER}
                '''
            }
        }
    }
    post {
        always {
            sh 'docker system prune -af || true'
        }
    }
}