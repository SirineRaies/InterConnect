pipeline {
    agent any
    triggers { pollSCM('H/5 * * * *') }
    environment {
        IMAGE_SERVER = 'sirineraies/interconnect-copie-server'
        IMAGE_CLIENT = 'sirineraies/interconnect-copie-client'
        KUBECONFIG = '/var/jenkins_home/.kube/config'  // Important pour kubectl/helm
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
                    docker logout
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
                    docker logout
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
                aquasec/trivy:latest \
                image --severity CRITICAL,HIGH \
                --timeout 10m \
                --exit-code 0 \
                $IMAGE_SERVER:${BUILD_NUMBER}

                echo "Scanning CLIENT image..."
                docker run --rm \
                -v /var/run/docker.sock:/var/run/docker.sock \
                aquasec/trivy:latest \
                image --severity CRITICAL,HIGH \
                --timeout 10m \
                --exit-code 0 \
                $IMAGE_CLIENT:${BUILD_NUMBER}
                '''
            }
        }

        stage('Deploy with HELM') {
            steps {
                script {
                    dir('k8s/Helm') {
                        sh '''
                        # Vérifier la connexion Kubernetes
                        kubectl cluster-info
                        kubectl get nodes
                        
                        # Déploiement de MongoDB
                        helm upgrade --install mongodb ./mongodb \
                          -n interconnect \
                          --create-namespace \
                          --wait \
                          --timeout 5m

                        # Déploiement du Serveur
                        helm upgrade --install server ./server \
                          -n interconnect \
                          --set image.tag=${BUILD_NUMBER} \
                          --set image.repository=$IMAGE_SERVER \
                          --wait \
                          --timeout 5m

                        # Déploiement du Client
                        helm upgrade --install client ./client \
                          -n interconnect \
                          --set image.tag=${BUILD_NUMBER} \
                          --set image.repository=$IMAGE_CLIENT \
                          --wait \
                          --timeout 5m
                        
                        # Afficher le statut des déploiements
                        echo "=== Deployments Status ==="
                        kubectl get deployments -n interconnect
                        echo "=== Pods Status ==="
                        kubectl get pods -n interconnect
                        echo "=== Services Status ==="
                        kubectl get svc -n interconnect
                        '''
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline succeeded! Application deployed successfully.'
            sh '''
            echo "=== Final Status ==="
            kubectl get all -n interconnect || true
            '''
        }
        failure {
            echo '❌ Pipeline failed! Check logs above.'
        }
        always {
            sh 'docker system prune -af || true'
        }
    }
}