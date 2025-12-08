const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testReservation() {
    console.log('🧪 Test de la fonctionnalité de réservation\n');
    
    try {
        // 1. Se connecter en tant que client
        console.log('1. Connexion en tant que client...');
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: 'client@example.com',
            password: 'client123'
        });
        
        const user = loginResponse.data.user;
        console.log('✅ Connecté en tant que:', user.email);
        
        // 2. Récupérer les ressources disponibles
        console.log('\n2. Récupération des ressources disponibles...');
        const resourcesResponse = await axios.get(`${API_URL}/resources/public`, {
            headers: { 'x-user-id': user.id }
        });
        
        const availableResources = resourcesResponse.data.resources.filter(r => r.status === 'available');
        console.log(`✅ ${availableResources.length} ressources disponibles`);
        
        if (availableResources.length === 0) {
            console.log('❌ Aucune ressource disponible pour tester');
            return;
        }
        
        // 3. Tester une réservation
        console.log('\n3. Test de réservation...');
        const resource = availableResources[0];
        
        // Calculer des dates (demain de 10h à 12h)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);
        
        const endTime = new Date(tomorrow);
        endTime.setHours(12, 0, 0, 0);
        
        const reservationData = {
            resource_id: resource.id,
            start_date: tomorrow.toISOString().slice(0, 19).replace('T', ' '),
            end_date: endTime.toISOString().slice(0, 19).replace('T', ' '),
            notes: 'Test de réservation automatisé'
        };
        
        console.log('📅 Données de réservation:', reservationData);
        
        const reservationResponse = await axios.post(`${API_URL}/reservations`, reservationData, {
            headers: { 'x-user-id': user.id }
        });
        
        console.log('✅ Réservation créée:', reservationResponse.data.message);
        console.log('📝 ID de réservation:', reservationResponse.data.reservationId);
        
        // 4. Vérifier les réservations de l'utilisateur
        console.log('\n4. Vérification des réservations utilisateur...');
        const myReservationsResponse = await axios.get(`${API_URL}/reservations/my-reservations`, {
            headers: { 'x-user-id': user.id }
        });
        
        console.log(`✅ ${myReservationsResponse.data.reservations.length} réservation(s) trouvée(s)`);
        
        // 5. Vérifier les notifications
        console.log('\n5. Vérification des notifications...');
        const notificationsResponse = await axios.get(`${API_URL}/notifications`, {
            headers: { 'x-user-id': user.id }
        });
        
        console.log(`✅ ${notificationsResponse.data.notifications.length} notification(s) reçue(s)`);
        
        console.log('\n🎉 Test de réservation réussi!');
        
    } catch (error) {
        console.error('\n❌ Erreur lors du test:', error.message);
        if (error.response) {
            console.error('Statut:', error.response.status);
            console.error('Message:', error.response.data.message);
            console.error('Données:', error.response.data);
        }
    }
}

testReservation();