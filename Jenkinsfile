pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 50, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10', artifactNumToKeepStr: '5'))
    }

    environment {
        PROJECT_DIR = "${WORKSPACE}"
        GIT_COMMIT_SHORT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
        GIT_COMMIT_MESSAGE = sh(script: "git log -1 --format=%B", returnStdout: true).trim()
        GIT_BRANCH = sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim()
        DOCKER_COMPOSE_FILE = "docker-compose.yml"
        COMPOSE_PROJECT_NAME = "online-movie-ticket-booking-system"
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "=========================================="
                    echo "STAGE: Checking out source code"
                    echo "=========================================="
                    echo "Repository: https://github.com/joshitha123306/Online-Movie-Ticket-Booking-System.git"
                    echo "Branch: ${GIT_BRANCH}"
                    echo "Commit: ${GIT_COMMIT_SHORT}"
                    echo "Message: ${GIT_COMMIT_MESSAGE}"
                }
                checkout scm
            }
        }

        stage('Verify Project') {
            steps {
                script {
                    echo "=========================================="
                    echo "STAGE: Verifying project structure"
                    echo "=========================================="
                }
                
                // Verify required files exist
                sh '''
                    echo "Checking required files..."
                    [ -f docker-compose.yml ] && echo "✓ docker-compose.yml found" || (echo "✗ docker-compose.yml NOT found" && exit 1)
                    [ -d backend ] && echo "✓ backend/ directory found" || (echo "✗ backend/ directory NOT found" && exit 1)
                    [ -d frontend ] && echo "✓ frontend/ directory found" || (echo "✗ frontend/ directory NOT found" && exit 1)
                    [ -f backend/Dockerfile ] && echo "✓ backend/Dockerfile found" || (echo "✗ backend/Dockerfile NOT found" && exit 1)
                    [ -f frontend/Dockerfile ] && echo "✓ frontend/Dockerfile found" || (echo "✗ frontend/Dockerfile NOT found" && exit 1)
                    [ -f backend/app.py ] && echo "✓ backend/app.py found" || (echo "✗ backend/app.py NOT found" && exit 1)
                    [ -f backend/requirements.txt ] && echo "✓ backend/requirements.txt found" || (echo "✗ backend/requirements.txt NOT found" && exit 1)
                    [ -f frontend/index.html ] && echo "✓ frontend/index.html found" || (echo "✗ frontend/index.html NOT found" && exit 1)
                    [ -f frontend/nginx.conf ] && echo "✓ frontend/nginx.conf found" || (echo "✗ frontend/nginx.conf NOT found" && exit 1)
                    echo ""
                    echo "Docker Compose configuration:"
                    cat docker-compose.yml
                '''
            }
        }

        stage('Verify Backend') {
            steps {
                script {
                    echo "=========================================="
                    echo "STAGE: Verifying backend configuration"
                    echo "=========================================="
                }
                
                sh '''
                    echo "Backend Python dependencies:"
                    cat backend/requirements.txt
                    echo ""
                    echo "Backend application entry point (app.py):"
                    head -20 backend/app.py
                '''
            }
        }

        stage('Verify Frontend') {
            steps {
                script {
                    echo "=========================================="
                    echo "STAGE: Verifying frontend configuration"
                    echo "=========================================="
                }
                
                sh '''
                    echo "Frontend Nginx configuration:"
                    cat frontend/nginx.conf
                    echo ""
                    echo "Frontend HTML entry point:"
                    head -10 frontend/index.html
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo "=========================================="
                    echo "STAGE: Building Docker images"
                    echo "=========================================="
                    echo "Building frontend and backend images without cache..."
                }
                
                sh '''
                    cd "${PROJECT_DIR}"
                    echo "Building images with docker compose..."
                    docker compose build --no-cache
                    echo ""
                    echo "Docker images built:"
                    docker images | grep online-movie-ticket-booking-system
                '''
            }
        }

        stage('Stop Old Containers') {
            steps {
                script {
                    echo "=========================================="
                    echo "STAGE: Stopping old containers"
                    echo "=========================================="
                    echo "Safely stopping only this project's containers..."
                }
                
                sh '''
                    cd "${PROJECT_DIR}"
                    docker compose down
                    echo "Old containers stopped and removed"
                '''
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    echo "=========================================="
                    echo "STAGE: Deploying with Docker Compose"
                    echo "=========================================="
                    echo "Starting frontend and backend containers..."
                }
                
                sh '''
                    cd "${PROJECT_DIR}"
                    docker compose up -d
                    echo ""
                    echo "Waiting for containers to start..."
                    sleep 5
                    echo ""
                    echo "Container status:"
                    docker compose ps
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    echo "=========================================="
                    echo "STAGE: Verifying deployment"
                    echo "=========================================="
                }
                
                sh '''
                    cd "${PROJECT_DIR}"
                    echo "Checking container status..."
                    docker compose ps
                    echo ""
                    echo "Verifying containers are running..."
                    docker ps | grep -E "movie_frontend|movie_backend" || (echo "Containers not running!" && exit 1)
                    echo ""
                    echo "Backend API test (localhost:5000/movies):"
                    sleep 3
                    curl -s http://localhost:5000/movies | head -50 || echo "Backend not responding yet"
                    echo ""
                    echo "Frontend test (localhost:8080):"
                    curl -s http://localhost:8080/ | head -20 || echo "Frontend not responding yet"
                '''
            }
        }
    }

    post {
        success {
            script {
                echo "=========================================="
                echo "BUILD SUCCESSFUL"
                echo "=========================================="
                echo "Commit: ${GIT_COMMIT_SHORT}"
                echo "Branch: ${GIT_BRANCH}"
                echo ""
                echo "Frontend is running at: http://localhost:8080"
                echo "Backend is running at: http://localhost:5000"
                echo "Backend API: http://localhost:5000/movies"
                echo ""
                echo "Docker containers:"
                sh 'docker compose ps'
            }
        }
        
        failure {
            script {
                echo "=========================================="
                echo "BUILD FAILED"
                echo "=========================================="
                echo "Commit: ${GIT_COMMIT_SHORT}"
                echo "Branch: ${GIT_BRANCH}"
                echo "Message: ${GIT_COMMIT_MESSAGE}"
                echo ""
                echo "Collecting diagnostic information..."
                sh '''
                    echo ""
                    echo "Docker Compose logs (backend):"
                    docker compose logs backend --tail=50 || echo "Could not get backend logs"
                    echo ""
                    echo "Docker Compose logs (frontend):"
                    docker compose logs frontend --tail=50 || echo "Could not get frontend logs"
                    echo ""
                    echo "Running containers:"
                    docker ps || echo "Could not list containers"
                    echo ""
                    echo "Docker images:"
                    docker images | grep online-movie-ticket-booking-system || echo "Could not list images"
                '''
            }
        }
        
        always {
            script {
                sh 'echo "Pipeline execution completed at $(date)"'
            }
        }
    }
}
