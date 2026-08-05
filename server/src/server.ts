import { buildApp } from './app';
import { env } from './config/env';

async function start() {
  try {
    const app = await buildApp();

    await app.listen({
      port: env.PORT,
      host: env.HOST,
    });

    console.log(`🚀 Servidor AgroGuard iniciado com sucesso!`);
    console.log(`📡 URL Base da API: ${env.API_BASE_URL}`);
    console.log(`📚 Documentação Swagger: ${env.API_BASE_URL}/api/docs`);
    console.log(`❤️ Health Check: ${env.API_BASE_URL}/api/health`);
  } catch (err) {
    console.error('❌ Erro ao inicializar o servidor AgroGuard:', err);
    process.exit(1);
  }
}

start();
