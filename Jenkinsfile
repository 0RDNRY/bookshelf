pipeline {
  agent any

  environment {
    COMPOSE_FILE = 'docker-compose.yml'
    APP_NAME     = 'bookshelf'
  }

  stages {

    stage('Checkout') {
      steps {
        echo '==> Cloning repository'
        checkout scm
      }
    }

    stage('Lint & Validate') {
      steps {
        echo '==> Validating docker-compose config'
        sh 'docker compose config'
      }
    }

    stage('Build Images') {
      steps {
        echo '==> Building all service images'
        sh 'docker compose build --no-cache'
      }
    }

    stage('Test: API Health') {
      steps {
        echo '==> Starting services and running health check'
        sh 'docker compose up -d'
        sh 'sleep 10'
        sh '''
          STATUS=$(docker exec bookshelf_api wget -qO- http://localhost:5000/api/health | grep -c "ok")
          if [ "$STATUS" -eq 1 ]; then echo "Health check passed"; else echo "Health check FAILED"; exit 1; fi
        '''
      }
    }

    stage('Deploy') {
      steps {
        echo '==> Services already running — deployment complete'
        sh 'docker compose ps'
      }
    }
  }

  post {
    failure {
      sh 'docker compose down || true'
      echo 'Pipeline failed. Containers stopped.'
    }
    success {
      echo 'Pipeline complete. App running at http://localhost:3000'
    }
  }
}
