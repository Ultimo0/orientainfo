// ========== AUTHENTIFICATION ==========
const API = 'https://orientainfo-backend-1.onrender.com';
let utilisateurConnecte = null;

// Afficher la page connexion au démarrage
window.addEventListener('load', () => {
    document.getElementById('page-connexion').classList.remove('cache');
    setTimeout(animerCompteurs, 800);
});

function afficherTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('actif'));

    if (tab === 'login') {
        document.getElementById('form-login').classList.remove('cache');
        document.getElementById('form-inscription').classList.add('cache');
        document.querySelectorAll('.tab')[0].classList.add('actif');
    } else {
        document.getElementById('form-login').classList.add('cache');
        document.getElementById('form-inscription').classList.remove('cache');
        document.querySelectorAll('.tab')[1].classList.add('actif');
    }
}

function afficherMessage(message, type) {
    const div = document.getElementById('message-auth');
    div.textContent = message;
    div.className = type === 'succes' ? 'message-succes' : 'message-erreur';
}

async function seConnecter() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        afficherMessage('Remplis tous les champs !', 'erreur');
        return;
    }

    afficherMessage('⏳ Connexion en cours... (peut prendre jusqu\'à 1 min)', 'succes');

    try {
        const response = await fetch(`${API}/connexion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, mot_de_passe: password })
        });

        const data = await response.json();

        if (response.ok) {
            utilisateurConnecte = data.utilisateur;
            localStorage.setItem('token', data.token);
            afficherMessage('✅ Connexion réussie !', 'succes');
            setTimeout(allerAccueil, 1000);
        } else {
            afficherMessage(data.message, 'erreur');
        }
    } catch (err) {
        afficherMessage('⚠️ Le serveur démarre, réessaie dans 30 secondes', 'erreur');
    }
}

async function sInscrire() {
    const nom = document.getElementById('inscription-nom').value;
    const email = document.getElementById('inscription-email').value;
    const password = document.getElementById('inscription-password').value;

    if (!nom || !email || !password) {
        afficherMessage('Remplis tous les champs !', 'erreur');
        return;
    }

    afficherMessage('⏳ Création en cours... (peut prendre jusqu\'à 1 min)', 'succes');

    try {
        const response = await fetch(`${API}/inscription`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nom, email, mot_de_passe: password })
        });

        const data = await response.json();

        if (response.ok) {
            afficherMessage('✅ Compte créé ! Connecte-toi maintenant.', 'succes');
            setTimeout(() => afficherTab('login'), 1500);
        } else {
            afficherMessage(data.message, 'erreur');
        }
    } catch (err) {
        afficherMessage('⚠️ Le serveur démarre, réessaie dans 30 secondes', 'erreur');
    }
}

function passer() {
    allerAccueil();
}

function allerAccueil() {
    document.getElementById('page-connexion').classList.add('cache');
    document.getElementById('page-accueil').classList.remove('cache');
}

// ========== PARTICULES ==========
const canvas = document.getElementById('particules');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const particulesList = [];
const NOMBRE_PARTICULES = 80;

class Particule {
    constructor() { this.reset(); }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.taille = Math.random() * 3 + 1;
        this.vitesseX = (Math.random() - 0.5) * 0.5;
        this.vitesseY = (Math.random() - 0.5) * 0.5;
        this.opacite = Math.random() * 0.5 + 0.1;
        this.couleur = this.choisirCouleur();
    }

    choisirCouleur() {
        const couleurs = [
            '102, 126, 234',
            '118, 75, 162',
            '255, 255, 255',
            '100, 200, 255',
        ];
        return couleurs[Math.floor(Math.random() * couleurs.length)];
    }

    dessiner() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.taille, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.couleur}, ${this.opacite})`;
        ctx.fill();
    }

    bouger() {
        this.x += this.vitesseX;
        this.y += this.vitesseY;
        if (this.x < 0 || this.x > canvas.width) this.vitesseX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vitesseY *= -1;
        this.opacite += (Math.random() - 0.5) * 0.02;
        this.opacite = Math.max(0.05, Math.min(0.6, this.opacite));
    }
}

for (let i = 0; i < NOMBRE_PARTICULES; i++) {
    particulesList.push(new Particule());
}

function relierParticules() {
    for (let i = 0; i < particulesList.length; i++) {
        for (let j = i + 1; j < particulesList.length; j++) {
            const dx = particulesList[i].x - particulesList[j].x;
            const dy = particulesList[i].y - particulesList[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 120) {
                ctx.beginPath();
                ctx.moveTo(particulesList[i].x, particulesList[i].y);
                ctx.lineTo(particulesList[j].x, particulesList[j].y);
                ctx.strokeStyle = `rgba(102, 126, 234, ${0.15 * (1 - distance / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animerParticules() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particulesList.forEach(p => { p.bouger(); p.dessiner(); });
    relierParticules();
    requestAnimationFrame(animerParticules);
}

animerParticules();

// ========== LES QUESTIONS ==========
const questions = [
    {
        texte: "Tu préfères travailler ?",
        options: [
            { texte: "Seul, en autonomie totale", scores: { SEC: 2, IA: 2, DATA: 2 } },
            { texte: "En petite équipe", scores: { WEB: 2, MOB: 2, GAME: 1 } },
            { texte: "En grande équipe structurée", scores: { CLOUD: 2, RESEAU: 2, DATA: 1 } },
            { texte: "Ça dépend du projet", scores: { WEB: 1, UX: 1, MOB: 1, DATA: 1 } }
        ]
    },
    {
        texte: "Tu es plutôt ?",
        options: [
            { texte: "Très créatif", scores: { UX: 3, GAME: 2, VR: 2 } },
            { texte: "Plutôt créatif", scores: { WEB: 2, GAME: 1, UX: 1 } },
            { texte: "Plutôt logique", scores: { SEC: 2, DATA: 1, CLOUD: 1 } },
            { texte: "Très logique", scores: { SEC: 3, IA: 3, BLOCKCHAIN: 2 } }
        ]
    },
    {
        texte: "Tu préfères ?",
        options: [
            { texte: "Créer des choses visibles", scores: { WEB: 3, UX: 3, GAME: 2 } },
            { texte: "Résoudre des problèmes complexes", scores: { SEC: 3, IA: 3, DATA: 3 } }
        ]
    },
    {
        texte: "Tu préfères ?",
        options: [
            { texte: "Analyser des données et des chiffres", scores: { DATA: 3, IA: 3, CLOUD: 1 } },
            { texte: "Construire des interfaces visuelles", scores: { UX: 3, WEB: 3, MOB: 2 } },
            { texte: "Configurer des systèmes et infrastructures", scores: { RESEAU: 3, CLOUD: 3, EMBED: 1 } },
            { texte: "Créer des mécanismes physiques/connectés", scores: { ROBOT: 3, EMBED: 3, VR: 1 } }
        ]
    },
    {
        texte: "Ce qui t'attire le plus ?",
        options: [
            { texte: "🎨 Design et visuel", scores: { UX: 3, GAME: 2, WEB: 2 } },
            { texte: "🔢 Maths et logique", scores: { IA: 3, DATA: 3, SEC: 2 } },
            { texte: "🔐 Sécurité et défis", scores: { SEC: 3, IA: 2, CLOUD: 1 } },
            { texte: "📊 Données et statistiques", scores: { DATA: 3, IA: 3, CLOUD: 1 } }
        ]
    },
    {
        texte: "Tu utilises plus ?",
        options: [
            { texte: "📱 Applis mobiles", scores: { MOB: 3, UX: 2, WEB: 1 } },
            { texte: "🌐 Sites web", scores: { WEB: 3, UX: 2, MOB: 1 } },
            { texte: "🎮 Jeux vidéo", scores: { GAME: 3, VR: 2, MOB: 1 } },
            { texte: "📡 Objets connectés (montre, maison connectée)", scores: { EMBED: 3, CLOUD: 2, RESEAU: 1 } },
            { texte: "₿ Applications crypto / wallets", scores: { BLOCKCHAIN: 3, SEC: 2, IA: 1 } }
        ]
    },
    {
        texte: "Tu es à l'aise avec les maths ?",
        options: [
            { texte: "Oui j'adore", scores: { IA: 3, DATA: 3, SEC: 2 } },
            { texte: "Moyennement", scores: { WEB: 2, MOB: 2, CLOUD: 2 } },
            { texte: "Pas vraiment", scores: { UX: 3, GAME: 3, WEB: 2 } }
        ]
    },
    {
        texte: "Tu aimes le design ?",
        options: [
            { texte: "Oui beaucoup", scores: { UX: 3, GAME: 3, WEB: 2 } },
            { texte: "Un peu", scores: { WEB: 2, MOB: 2, GAME: 1 } },
            { texte: "Pas du tout", scores: { SEC: 3, DATA: 3, IA: 2 } }
        ]
    },
    {
        texte: "Tu aimes comprendre comment les choses fonctionnent ?",
        options: [
            { texte: "Oui, jusqu'au moindre détail technique", scores: { SEC: 3, EMBED: 3, ROBOT: 2 } },
            { texte: "Oui, surtout les systèmes", scores: { CLOUD: 3, RESEAU: 3, IA: 1 } },
            { texte: "Parfois, ça dépend du sujet", scores: { WEB: 2, MOB: 2, DATA: 2 } },
            { texte: "Non, je préfère juste utiliser", scores: { UX: 3, GAME: 2, WEB: 2 } }
        ]
    },
    {
        texte: "Tu aimes expliquer aux autres ?",
        options: [
            { texte: "Oui j'adore", scores: { UX: 2, WEB: 2, CLOUD: 2 } },
            { texte: "Ça dépend", scores: { MOB: 2, DATA: 2, GAME: 2 } },
            { texte: "Non je préfère travailler seul", scores: { SEC: 3, IA: 3, DATA: 2 } }
        ]
    },
    {
        texte: "Tu veux travailler dans quelle ambiance ?",
        options: [
            { texte: "🏢 Grande entreprise / banque", scores: { CLOUD: 3, RESEAU: 2, SEC: 2 } },
            { texte: "🚀 Startup", scores: { WEB: 3, MOB: 3, UX: 2 } },
            { texte: "🏠 Freelance / indépendant", scores: { UX: 3, WEB: 2, GAME: 2 } },
            { texte: "🔬 Recherche / laboratoire", scores: { IA: 3, DATA: 3, ROBOT: 2 } },
            { texte: "🏭 Industrie / usine connectée", scores: { EMBED: 3, ROBOT: 3, RESEAU: 1 } }
        ]
    },
    {
        texte: "Ton objectif principal ?",
        options: [
            { texte: "💰 Gagner beaucoup", scores: { CLOUD: 3, BLOCKCHAIN: 3, SEC: 2 } },
            { texte: "🌍 Impact sur le monde", scores: { IA: 3, DATA: 2, ROBOT: 2 } },
            { texte: "🎨 Exprimer ma créativité", scores: { UX: 3, GAME: 3, VR: 2 } },
            { texte: "🧠 Apprendre en permanence", scores: { SEC: 3, IA: 3, EMBED: 2 } },
            { texte: "🛡️ Protéger / sécuriser des systèmes", scores: { SEC: 3, RESEAU: 3, CLOUD: 1 } }
        ]
    },
    {
        texte: "Tu préfères ?",
        options: [
            { texte: "Résultats visibles immédiatement", scores: { WEB: 3, UX: 3, MOB: 2 } },
            { texte: "Résultats en quelques jours", scores: { GAME: 2, EMBED: 2, MOB: 1 } },
            { texte: "Résultats en plusieurs semaines", scores: { CLOUD: 2, RESEAU: 2, DATA: 2 } },
            { texte: "Projets longs et profonds (mois/années)", scores: { IA: 3, DATA: 3, SEC: 2, ROBOT: 2 } }
        ]
    },
    {
        texte: "Tu préfères ?",
        options: [
            { texte: "Nouvelles technologies", scores: { IA: 3, CLOUD: 3, MOB: 2 } },
            { texte: "Technologies stables", scores: { WEB: 3, DATA: 2, SEC: 2 } }
        ]
    },
    {
        texte: "Dans 5 ans tu te vois ?",
        options: [
            { texte: "👨‍💻 Développeur", scores: { WEB: 3, MOB: 3, GAME: 2 } },
            { texte: "🎨 Designer", scores: { UX: 3, VR: 2, WEB: 2 } },
            { texte: "🔐 Expert sécurité", scores: { SEC: 3, RESEAU: 2, CLOUD: 2 } },
            { texte: "📊 Data Scientist", scores: { DATA: 3, IA: 3, CLOUD: 2 } },
            { texte: "☁️ Ingénieur Cloud/Réseau", scores: { CLOUD: 3, RESEAU: 3, SEC: 2 } },
            { texte: "🤖 Ingénieur Robotique/Embarqué", scores: { ROBOT: 3, EMBED: 3, IA: 2 } },
            { texte: "⛓️ Développeur Blockchain", scores: { BLOCKCHAIN: 3, SEC: 2, WEB: 1 } }
        ]
    },
    {
        texte: "Qu'est-ce qui t'intéresse le plus parmi ça ?",
        options: [
            { texte: "🔧 Bidouiller des objets connectés (Arduino, capteurs)", scores: { EMBED: 3, ROBOT: 2, RESEAU: 1 } },
            { texte: "⛓️ Les cryptomonnaies et la blockchain", scores: { BLOCKCHAIN: 3, SEC: 2, IA: 1 } },
            { texte: "🌐 Configurer des réseaux et serveurs", scores: { RESEAU: 3, CLOUD: 2, SEC: 1 } },
            { texte: "🥽 Créer des mondes virtuels immersifs", scores: { VR: 3, GAME: 2, UX: 1 } },
            { texte: "🤖 Construire et programmer des robots", scores: { ROBOT: 3, EMBED: 2, IA: 1 } }
        ]
    }
];

// ========== INFOS DES BRANCHES ==========
const branches = {
    WEB: {
        nom: "Développement Web 🌐",
        desc: "Crée des sites et applications web. Tu maîtriseras HTML, CSS, JavaScript, et des frameworks comme React ou Vue.",
        ressources: "freeCodeCamp, The Odin Project, MDN Web Docs",
        debouches: ["Développeur Front-end", "Développeur Back-end", "Développeur Full-stack", "Intégrateur web"],
        salaire: "600$ - 5000$ / mois",
        duree: "6 mois pour les bases"
    },
    MOB: {
        nom: "Développement Mobile 📱",
        desc: "Crée des applications pour Android et iOS avec Flutter, React Native ou Kotlin.",
        ressources: "Flutter.dev, Android Developers, React Native Docs",
        debouches: ["Développeur Android", "Développeur iOS", "Développeur Flutter", "Développeur React Native"],
        salaire: "800$ - 6000$ / mois",
        duree: "8 mois pour les bases"
    },
    SEC: {
        nom: "Cybersécurité 🔐",
        desc: "Protège les systèmes informatiques contre les attaques. Tu apprendras l'ethical hacking, la cryptographie et la forensique.",
        ressources: "TryHackMe, HackTheBox, Cybrary",
        debouches: ["Analyste sécurité", "Ethical Hacker", "Expert forensique", "Consultant cybersécurité"],
        salaire: "1000$ - 8000$ / mois",
        duree: "12 mois pour les bases"
    },
    IA: {
        nom: "Intelligence Artificielle 🤖",
        desc: "Crée des systèmes capables d'apprendre et de raisonner. Tu maîtriseras Python, TensorFlow et les mathématiques.",
        ressources: "Coursera Andrew Ng, Fast.ai, Kaggle",
        debouches: ["Ingénieur ML", "Data Scientist", "Chercheur IA", "Ingénieur NLP"],
        salaire: "1200$ - 10000$ / mois",
        duree: "12-18 mois pour les bases"
    },
    UX: {
        nom: "UI/UX Design 🎨",
        desc: "Conçois des interfaces belles et intuitives. Tu utiliseras Figma, Adobe XD et tu étudieras la psychologie des utilisateurs.",
        ressources: "Figma, Google UX Design Certificate, Dribbble",
        debouches: ["UI Designer", "UX Designer", "Product Designer", "Web Designer"],
        salaire: "500$ - 4000$ / mois",
        duree: "4-6 mois pour les bases"
    },
    DATA: {
        nom: "Data Science 📊",
        desc: "Analyse de grandes quantités de données pour en extraire des insights. Tu maîtriseras Python, SQL et la statistique.",
        ressources: "Kaggle, DataCamp, Towards Data Science",
        debouches: ["Data Scientist", "Data Analyst", "Data Engineer", "Business Analyst"],
        salaire: "1000$ - 8000$ / mois",
        duree: "10-12 mois pour les bases"
    },
    CLOUD: {
        nom: "Cloud & DevOps ☁️",
        desc: "Gère les infrastructures informatiques dans le cloud. Tu travailleras avec AWS, Azure, Docker et Kubernetes.",
        ressources: "AWS Training, Google Cloud Skills, Linux Foundation",
        debouches: ["Ingénieur Cloud", "DevOps Engineer", "Administrateur système", "Architecte cloud"],
        salaire: "1000$ - 9000$ / mois",
        duree: "10 mois pour les bases"
    },
    GAME: {
        nom: "Développement Jeux Vidéo 🎮",
        desc: "Crée des jeux vidéo avec Unity ou Unreal Engine. Tu combineras programmation, design et créativité.",
        ressources: "Unity Learn, Unreal Online Learning, GameDev.tv",
        debouches: ["Game Developer", "Game Designer", "Level Designer", "Programmeur moteur"],
        salaire: "600$ - 5000$ / mois",
        duree: "8-10 mois pour les bases"
    },
    EMBED: {
        nom: "Développement Embarqué 🔧",
        desc: "Programme des objets physiques comme Arduino, Raspberry Pi et capteurs IoT. Tu combineras code et électronique.",
        ressources: "Arduino.cc, Raspberry Pi Foundation, Udemy IoT",
        debouches: ["Ingénieur embarqué", "Développeur IoT", "Ingénieur firmware", "Technicien robotique"],
        salaire: "700$ - 6000$ / mois",
        duree: "8-10 mois pour les bases"
    },
    BLOCKCHAIN: {
        nom: "Blockchain ⛓️",
        desc: "Crée des applications décentralisées et des smart contracts. Tu maîtriseras Solidity, Web3 et la cryptographie.",
        ressources: "CryptoZombies, Solidity Docs, Alchemy University",
        debouches: ["Développeur Blockchain", "Smart Contract Developer", "Architecte Web3", "Consultant crypto"],
        salaire: "1000$ - 9000$ / mois",
        duree: "8-10 mois pour les bases"
    },
    RESEAU: {
        nom: "Administration Réseau 🌐",
        desc: "Configure et sécurise les réseaux informatiques d'entreprise. Tu maîtriseras Cisco, les protocoles réseau et la sécurité.",
        ressources: "Cisco Packet Tracer, CCNA, Network Chuck",
        debouches: ["Administrateur réseau", "Ingénieur réseau", "Technicien systèmes", "Architecte réseau"],
        salaire: "600$ - 5000$ / mois",
        duree: "10 mois pour les bases"
    },
    VR: {
        nom: "Réalité Virtuelle / Augmentée 🥽",
        desc: "Crée des expériences immersives en VR/AR avec Unity ou Unreal Engine. Combine 3D, interaction et créativité.",
        ressources: "Unity VR, Meta Developer, Udacity AR/VR",
        debouches: ["Développeur VR/AR", "Designer XR", "Ingénieur immersif", "Game Developer VR"],
        salaire: "800$ - 7000$ / mois",
        duree: "10-12 mois pour les bases"
    },
    ROBOT: {
        nom: "Robotique 🤖",
        desc: "Conçois et programme des robots. Tu combineras mécanique, électronique et intelligence artificielle.",
        ressources: "ROS (Robot Operating System), Coursera Robotics, MIT OpenCourseWare",
        debouches: ["Ingénieur robotique", "Chercheur en robotique", "Développeur ROS", "Ingénieur automatisation"],
        salaire: "900$ - 8000$ / mois",
        duree: "12-15 mois pour les bases"
    }
};

// ========== VARIABLES ==========
let questionActuelle = 0;
let scores = { WEB: 0, MOB: 0, SEC: 0, IA: 0, UX: 0, DATA: 0, CLOUD: 0, GAME: 0, EMBED: 0, BLOCKCHAIN: 0, RESEAU: 0, VR: 0, ROBOT: 0 };

// ========== FONCTIONS ==========
function demarrer() {
    document.getElementById('page-accueil').classList.add('cache');
    document.getElementById('page-questions').classList.remove('cache');
    afficherQuestion();
}

function afficherQuestion() {
    const q = questions[questionActuelle];
    document.getElementById('num-question').textContent = questionActuelle + 1;

    const pourcent = Math.round((questionActuelle / questions.length) * 100);
    document.getElementById('barre-fill').style.width = pourcent + '%';
    document.getElementById('pourcent-progress').textContent = pourcent + '%';

    document.getElementById('question-texte').textContent = q.texte;

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';

    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option.texte;
        btn.onclick = () => choisirOption(index);
        optionsDiv.appendChild(btn);
    });
}

function choisirOption(index) {
    const option = questions[questionActuelle].options[index];

    for (let branche in option.scores) {
        scores[branche] += option.scores[branche];
    }

    const container = document.getElementById('page-questions');
    container.classList.add('animer-sortie');

    setTimeout(() => {
        questionActuelle++;
        container.classList.remove('animer-sortie');

        if (questionActuelle < questions.length) {
            afficherQuestion();
            container.classList.add('animer-entree');
            setTimeout(() => container.classList.remove('animer-entree'), 400);
        } else {
            afficherResultats();
        }
    }, 400);
}

function afficherResultats() {
    document.getElementById('page-questions').classList.add('cache');
    document.getElementById('page-resultats').classList.remove('cache');

    lancerConfettis();

    // Sauvegarder le résultat si connecté
    const token = localStorage.getItem('token');
    if (token) {
        const classementTemp = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        const branchePrincipale = classementTemp[0][0];

    fetch(`${API}/sauvegarder-resultat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, branche_principale: branchePrincipale })
    });
}

    const classement = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const scoreMax = classement[0][1];

    document.getElementById('barre-fill').style.width = '100%';
    document.getElementById('pourcent-progress').textContent = '100%';

    const principale = classement[0];
    const infoPrincipale = branches[principale[0]];
    const pourcent1 = Math.round((principale[1] / scoreMax) * 100);

    document.getElementById('resultat-principal').innerHTML = `
        <div class="carte-resultat carte-principale">
            <h3>🥇 Ta branche idéale</h3>
            <h2>${infoPrincipale.nom}</h2>
            <p>${infoPrincipale.desc}</p>
            <div class="score-bar">
                <div class="score-fill" style="width:${pourcent1}%"></div>
            </div>
            <p class="score-texte">Compatibilité : <strong>${pourcent1}%</strong></p>
            <div class="info-grid">
                <div class="info-bloc">
                    <h4>💼 Débouchés</h4>
                    <ul>${infoPrincipale.debouches.map(d => `<li>${d}</li>`).join('')}</ul>
                </div>
                <div class="info-bloc">
                    <h4>💰 Salaire moyen</h4>
                    <p class="salaire">${infoPrincipale.salaire}</p>
                    <h4>⏱️ Durée d'apprentissage</h4>
                    <p class="duree">${infoPrincipale.duree}</p>
                </div>
            </div>
            <div class="tags">
                <span class="tag">📚 ${infoPrincipale.ressources}</span>
            </div>
        </div>
    `;

    let htmlAlternatives = '<h3 class="titre-alternatives">🎯 Tes branches alternatives</h3>';
    const medailles = ['🥈', '🥉'];

    for (let i = 1; i <= 2; i++) {
        const alt = classement[i];
        const infoAlt = branches[alt[0]];
        const pourcentAlt = Math.round((alt[1] / scoreMax) * 100);

        htmlAlternatives += `
            <div class="carte-resultat">
                <h3>${medailles[i-1]} ${infoAlt.nom}</h3>
                <p>${infoAlt.desc}</p>
                <div class="score-bar">
                    <div class="score-fill" style="width:${pourcentAlt}%"></div>
                </div>
                <p class="score-texte">Compatibilité : <strong>${pourcentAlt}%</strong></p>
                <div class="info-grid">
                    <div class="info-bloc">
                        <h4>💼 Débouchés</h4>
                        <ul>${infoAlt.debouches.map(d => `<li>${d}</li>`).join('')}</ul>
                    </div>
                    <div class="info-bloc">
                        <h4>💰 Salaire</h4>
                        <p class="salaire">${infoAlt.salaire}</p>
                        <h4>⏱️ Durée</h4>
                        <p class="duree">${infoAlt.duree}</p>
                    </div>
                </div>
                <div class="tags">
                    <span class="tag">📚 ${infoAlt.ressources}</span>
                </div>
            </div>
        `;
    }

    let htmlToutes = '<h3 class="titre-alternatives">📊 Ton classement complet</h3>';
    htmlToutes += '<div class="classement-complet">';

    classement.forEach((item, index) => {
        const info = branches[item[0]];
        const p = Math.round((item[1] / scoreMax) * 100);
        htmlToutes += `
            <div class="ligne-classement">
                <span class="rang">${index + 1}</span>
                <span class="nom-branche">${info.nom}</span>
                <div class="score-bar mini">
                    <div class="score-fill" style="width:${p}%"></div>
                </div>
                <span class="score-texte">${p}%</span>
            </div>
        `;
    });

    htmlToutes += '</div>';

    document.getElementById('resultat-alternatives').innerHTML =
        htmlAlternatives + htmlToutes;
}

function recommencer() {
    questionActuelle = 0;
    scores = { WEB: 0, MOB: 0, SEC: 0, IA: 0, UX: 0, DATA: 0, CLOUD: 0, GAME: 0, EMBED: 0, BLOCKCHAIN: 0, RESEAU: 0, VR: 0, ROBOT: 0 };
    document.getElementById('page-resultats').classList.add('cache');
    document.getElementById('page-accueil').classList.remove('cache');
}

function afficherNotification(message) {
    const notif = document.getElementById('notification');
    notif.textContent = message;
    notif.classList.add('visible');
    setTimeout(() => notif.classList.remove('visible'), 3000);
}

function partager() {
    const classement = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const principale = branches[classement[0][0]].nom;
    const alt1 = branches[classement[1][0]].nom;
    const alt2 = branches[classement[2][0]].nom;

    const texte = `🎯 Mon orientation en informatique :\n\n` +
        `🥇 Branche idéale : ${principale}\n` +
        `🥈 Alternative 1 : ${alt1}\n` +
        `🥉 Alternative 2 : ${alt2}\n\n` +
        `Découvre ta branche sur OrientaInfo !`;

    if (navigator.share) {
        navigator.share({
            title: 'OrientaInfo - Mon résultat',
            text: texte,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(texte);
        afficherNotification('✅ Résultats copiés dans le presse-papier !');
    }
}

function copierLien() {
    navigator.clipboard.writeText(window.location.href);
    afficherNotification('🔗 Lien copié dans le presse-papier !');
}

function envoyerWhatsApp() {
    const classement = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const branchePrincipale = branches[classement[0][0]].nom;
    const alt1Final = branches[classement[1][0]].nom;
    const alt2Final = branches[classement[2][0]].nom;

    const messageWhatsApp = encodeURIComponent(
        `🎯 *Mon résultat OrientaInfo*\n\n` +
        `🥇 Branche idéale : *${branchePrincipale}*\n` +
        `🥈 Alternative 1 : *${alt1Final}*\n` +
        `🥉 Alternative 2 : *${alt2Final}*\n\n` +
        `💬 Mon avis sur l'app : \n\n` +
        `🔗 Testez aussi : https://Ultimo0.github.io/orientainfo`
    );

    const lienWhatsApp = `https://wa.me/237652492874?text=${messageWhatsApp}`;
    window.open(lienWhatsApp, '_blank');
}

// ========== CONFETTIS ==========
function lancerConfettis() {
    confetti({
        particleCount: 80,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.7 },
        colors: ['#667eea', '#764ba2', '#ffffff', '#4facfe']
    });

    confetti({
        particleCount: 80,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.7 },
        colors: ['#667eea', '#764ba2', '#ffffff', '#FFD700']
    });

    setTimeout(() => {
        confetti({
            particleCount: 100,
            spread: 100,
            origin: { x: 0.5, y: 0.5 },
            colors: ['#667eea', '#764ba2', '#ffffff', '#4facfe', '#FFD700'],
            startVelocity: 30,
            gravity: 0.8
        });
    }, 500);

    setTimeout(() => {
        confetti({
            particleCount: 50,
            spread: 160,
            origin: { x: 0.5, y: 0 },
            colors: ['#667eea', '#764ba2', '#ffffff'],
            startVelocity: 20,
            gravity: 0.5,
            ticks: 200
        });
    }, 1000);
}

// ========== COMPTEUR ANIMÉ ==========
function animerCompteurs() {
    const compteurs = document.querySelectorAll('.stat-nombre');
    compteurs.forEach(compteur => {
        const cible = parseInt(compteur.getAttribute('data-target'));
        const duree = 1500;
        const increment = cible / (duree / 16);
        let actuel = 0;

        const timer = setInterval(() => {
            actuel += increment;
            if (actuel >= cible) {
                actuel = cible;
                clearInterval(timer);
            }
            compteur.textContent = Math.floor(actuel);
        }, 16);
    });
}

window.addEventListener('load', () => {
    setTimeout(animerCompteurs, 800);
});
