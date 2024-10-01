import { LanguageServiceClient } from '@google-cloud/language';

const client = new LanguageServiceClient({
  keyFilename: './src/config/google-cloud-key.json',
});

// Función para analizar el sentimiento
export const analyzeSentiment = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).send('Texto requerido para el análisis.');
  }

  try {
    const sentiment = await getSentimentAnalysis(text);
    const entities = await analyzeEntities(text);

    // Generar un mensaje personalizado
    const personalizedMessage = generatePersonalizedMessage(sentiment, entities);

    res.json({
      score: sentiment.score,
      magnitude: sentiment.magnitude,
      message: personalizedMessage
    });
  } catch (error) {
    console.error('Error al analizar el sentimiento:', error);
    res.status(500).send('Error en el análisis de sentimiento');
  }
};

// Función para obtener el análisis de sentimiento
const getSentimentAnalysis = async (text) => {
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };
  const [result] = await client.analyzeSentiment({ document });
  return result.documentSentiment;
};

// Función para analizar entidades
const analyzeEntities = async (text) => {
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };
  const [result] = await client.analyzeEntities({ document });
  return result.entities;
};

// Función para generar un mensaje personalizado
const generatePersonalizedMessage = (sentiment, entities) => {
  let response = 'Gracias por tu mensaje. ';

  // Entidades
  if (entities.length > 0) {
    let entity = entities[0];
    if (entity.type === 'OTHER') {
      response += `He notado que mencionaste ${entity.name}. `;
    } else if (entity.type === 'PERSON') {
      response += `He notado que mencionaste a ${entity.name}. `;
    } else if (entity.type === 'LOCATION') {
      response += `He notado que mencionaste el lugar ${entity.name}. `;
    }
  }

  // Sentimiento
  if (sentiment.score > 0.5) {
    response += '¡Sigue disfrutando de tu buen estado de ánimo! Tal vez podrías hacer algo activo, como dar un paseo o reunirte con amigos.';
  } else if (sentiment.score < -0.5) {
    response += 'Entiendo que no estás en tu mejor momento. Te recomendaría tomarte un tiempo para ti, como hacer una actividad relajante, meditar o ver una película tranquila.';
  } else {
    response += 'Parece que tu día ha sido neutral. Tal vez podrías aprovechar para reflexionar o hacer algo que te guste, como leer o escuchar música.';
  }

  return response;
};