/** Editorial starters for the portfolio blog. These are technical guides, not claims about completed work. */
export type SeedArticle = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  en: { title: string; excerpt: string; content: string };
};

export const baseArticlesContent: SeedArticle[] = [
  {
    slug: "concevoir-api-rest-laravel",
    title: "Concevoir une API REST Laravel qui reste claire en grandissant",
    excerpt: "Routes, validation, autorisation et réponses : une méthode simple pour garder une API Laravel lisible et sûre.",
    tags: ["Laravel", "PHP", "REST API", "Backend"],
    content: `## Partir du contrat, pas du contrôleur

Avant d'écrire une route, je décris la ressource, les opérations autorisées et les réponses attendues. Pour une réservation, cela signifie distinguer la création, la lecture, l'annulation et les changements d'état. Chaque opération doit avoir une entrée validée, un résultat prévisible et des erreurs compréhensibles.

## Séparer les responsabilités

- La route exprime l'URL et la méthode HTTP.
- La validation refuse les données mal formées avant la logique métier.
- L'autorisation vérifie que la personne peut agir sur **cette ressource précise**.
- Le service métier coordonne les règles qui ne doivent pas dépendre du transport HTTP.
- Une ressource de réponse définit les champs exposés au client.

Ce découpage évite que le contrôleur devienne le seul endroit où vivent les règles. Une authentification valide ne suffit pas : un utilisateur connecté ne doit pas pouvoir consulter la réservation d'un autre en changeant simplement son identifiant dans l'URL.

## Un contrôle utile avant publication

Je teste au minimum un cas heureux, une entrée invalide, un accès non autorisé et une ressource absente. Je documente ces quatre réponses dans OpenAPI afin que le web et le mobile consomment le même contrat. Les secrets restent côté serveur et les journaux ne doivent pas contenir de données sensibles.

**À retenir :** une API évolue mieux quand sa validation, ses permissions et son format de réponse sont explicites dès le départ.

Pour aller plus loin : [documentation Laravel](https://laravel.com/docs).`,
    en: {
      title: "Designing a Laravel REST API that stays clear as it grows",
      excerpt: "Routes, validation, authorization and responses: a practical approach to a readable and safer Laravel API.",
      content: `## Start with the contract, not the controller

Before writing a route, describe the resource, allowed operations and expected responses. A booking API, for example, needs distinct operations for creation, reading, cancellation and status changes. Each operation needs validated input, a predictable result and understandable errors.

## Separate responsibilities

- Routes express URLs and HTTP methods.
- Validation rejects malformed data before business rules run.
- Authorization checks access to **the specific resource**.
- Business services coordinate rules independently of HTTP.
- Response resources define the fields exposed to clients.

This separation keeps controllers small. Authentication alone is insufficient: a signed-in user must not see another user's booking by changing an identifier in a URL.

## A useful release check

Test a successful request, invalid input, unauthorized access and a missing resource. Document those responses in OpenAPI so web and mobile clients share the same contract. Keep secrets on the server and sensitive data out of logs.

**Takeaway:** APIs scale more comfortably when validation, permissions and response formats are explicit from the start.

Further reading: [Laravel documentation](https://laravel.com/docs).`,
    },
  },
  {
    slug: "react-nextjs-frontiere-serveur-client",
    title: "React et Next.js : placer la bonne logique au bon endroit",
    excerpt: "Une frontière serveur-client bien choisie réduit le JavaScript envoyé au navigateur sans sacrifier l'interactivité.",
    tags: ["React", "Next.js", "TypeScript", "Frontend"],
    content: `## Chaque interaction a son lieu

Une page de portfolio peut afficher des données depuis le serveur et ne rendre interactifs que ses filtres ou préférences. Dans l'App Router de Next.js, les pages et les layouts sont des composants serveur par défaut. Un composant client devient utile lorsqu'il a besoin d'état, d'événements ou d'API du navigateur.

Je commence donc par rendre le contenu côté serveur, puis je place la frontière client autour de la plus petite zone interactive. Une liste de projets peut être produite sur le serveur ; son filtre, lui, peut vivre dans un composant client recevant les projets comme propriétés.

## Trois questions à poser

1. Cette donnée dépend-elle d'un secret ou d'une requête à la base ? Elle reste sur le serveur.
2. Cette interface réagit-elle à un clic, une saisie ou au stockage local ? Elle a besoin d'une partie cliente.
3. Le contenu doit-il rester lisible pendant le chargement ? Je prévois un état de chargement et une structure HTML utile.

Le choix ne dispense pas de vérifier l'accessibilité : un filtre doit annoncer son état, être utilisable au clavier et garder des résultats lisibles. La performance se mesure sur une page réelle, pas seulement sur la taille d'un composant.

Pour aller plus loin : [Server and Client Components de Next.js](https://nextjs.org/docs/app/getting-started/server-and-client-components).`,
    en: {
      title: "React and Next.js: putting logic in the right place",
      excerpt: "A well-chosen server-client boundary limits browser JavaScript while keeping the interface interactive.",
      content: `## Each interaction has its place

A portfolio page can render data on the server and make only its filters or preferences interactive. In the Next.js App Router, pages and layouts are Server Components by default. Client Components are useful when state, event handlers or browser APIs are required.

Start with server-rendered content, then place the client boundary around the smallest interactive area. A project list can be prepared on the server while its filter is a Client Component receiving projects as props.

## Three questions to ask

1. Does this data require a secret or a database query? Keep it on the server.
2. Does this UI react to a click, typing or local storage? It needs a client-side part.
3. Should the content remain understandable while loading? Provide a useful HTML structure and loading state.

This decision does not replace accessibility work: a filter should expose its state, support keyboards and keep results readable. Measure performance on a real page, not only by component size.

Further reading: [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components).`,
    },
  },
  {
    slug: "react-native-expo-notifications-utiles",
    title: "React Native et Expo : des notifications réellement utiles",
    excerpt: "Permission, contexte et retour utilisateur : comment penser les notifications d'une application mobile avant l'intégration technique.",
    tags: ["React Native", "Expo", "Mobile", "Notifications"],
    content: `## Une notification est une décision produit

Un rappel de départ, une confirmation de réservation ou un changement important de statut peuvent aider l'utilisateur. Une notification sans contexte devient vite du bruit. Je définis d'abord l'événement qui la déclenche, le moment d'envoi et l'action attendue après ouverture.

## Le parcours à vérifier

- Demander l'autorisation au moment où sa valeur est compréhensible.
- Prévoir le cas où la permission est refusée : l'information essentielle reste disponible dans l'application.
- Associer chaque appareil et son jeton de notification au bon compte, puis gérer les jetons devenus invalides.
- Éviter les doublons lors des reprises réseau et des changements d'état.
- Tester l'ouverture d'une notification vers le bon écran, y compris après un démarrage à froid.

Les notifications relèvent aussi de la confidentialité : le texte affiché sur l'écran verrouillé ne devrait pas révéler une information sensible. En développement, je teste sur les plateformes ciblées et distingue une notification reçue, affichée et effectivement ouverte.

**À retenir :** l'intégration Expo est une partie du travail ; le vrai résultat est un message opportun, fiable et respectueux du choix de l'utilisateur.

Pour aller plus loin : [guide Expo Notifications](https://docs.expo.dev/push-notifications/overview/).`,
    en: {
      title: "React Native and Expo: notifications that are actually useful",
      excerpt: "Permission, timing and feedback: plan the mobile notification journey before integrating the service.",
      content: `## A notification is a product decision

A departure reminder, booking confirmation or important status change can help users. An out-of-context alert quickly becomes noise. Define the triggering event, delivery time and expected action after opening it.

## The journey to verify

- Ask for permission when the benefit is clear.
- Handle refusal: essential information must remain available inside the app.
- Associate each device and push token with the right account, and handle invalid tokens.
- Avoid duplicates during network retries and status changes.
- Test deep links to the correct screen, including a cold start.

Notifications also affect privacy: lock-screen text should not reveal sensitive information. Test on each target platform and distinguish receipt, display and actual opening.

**Takeaway:** Expo integration is only one part; the outcome is a timely, reliable message that respects user choice.

Further reading: [Expo Notifications guide](https://docs.expo.dev/push-notifications/overview/).`,
    },
  },
  {
    slug: "postgresql-indexer-requetes-reelles",
    title: "PostgreSQL : indexer les requêtes réelles, pas les intuitions",
    excerpt: "Un index peut accélérer une lecture, mais a aussi un coût : voici comment décider à partir des usages et des plans de requête.",
    tags: ["PostgreSQL", "SQL", "Database", "Performance"],
    content: `## Partir de la requête qui pose problème

Ajouter un index sur toutes les colonnes n'est pas une stratégie. Je pars d'une requête représentative : par exemple les réservations récentes d'un compte, filtrées par statut et triées par date. Je relève son temps d'exécution, la taille des tables et la fréquence de l'opération.

## Examiner avant de modifier

Avec EXPLAIN, puis EXPLAIN ANALYZE dans un environnement adapté, je regarde le plan choisi et les lignes réellement parcourues. Un index sur une colonne filtrée peut aider, mais son intérêt dépend de la sélectivité, du tri et des volumes. Les écritures et le stockage paient aussi le coût de chaque index supplémentaire.

Pour une application multi-tenant, la clé du tenant doit être présente dans les requêtes concernées et dans la réflexion sur les index. L'index ne corrige pas une requête qui oublie d'isoler les données d'un tenant : c'est d'abord une question de sécurité et de modèle de données.

Je mesure à nouveau après changement, avec des données proches de la réalité, puis je conserve l'index seulement si le gain justifie son coût.

Pour aller plus loin : [index PostgreSQL](https://www.postgresql.org/docs/current/indexes.html) et [EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html).`,
    en: {
      title: "PostgreSQL: index real queries, not guesses",
      excerpt: "An index can speed up reads but has a cost; decide from workloads and query plans.",
      content: `## Start with the slow query

Indexing every column is not a strategy. Start with a representative query, such as a customer's recent bookings filtered by status and ordered by date. Record its execution time, table sizes and usage frequency.

## Inspect before changing

Use EXPLAIN, then EXPLAIN ANALYZE in an appropriate environment, to inspect the chosen plan and rows actually read. An index on a filtered column may help, but value depends on selectivity, sorting and data volume. Each additional index also costs storage and write time.

For multi-tenant applications, include the tenant key in relevant queries and index design. An index cannot fix a query that fails to isolate one tenant's data: that is first a data-model and security issue.

Measure again after the change using representative data, and keep the index only when its benefit justifies the cost.

Further reading: [PostgreSQL indexes](https://www.postgresql.org/docs/current/indexes.html) and [EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html).`,
    },
  },
  {
    slug: "docker-compose-pipeline-livraison",
    title: "Docker Compose et CI/CD : rendre une livraison reproductible",
    excerpt: "Du poste local à la pipeline, les mêmes services et contrôles réduisent les écarts entre environnements.",
    tags: ["Docker", "Docker Compose", "CI/CD", "DevOps"],
    content: `## Décrire l'application comme un ensemble de services

Une application web dépend souvent d'une base, parfois d'un cache ou d'un worker. Docker Compose décrit ces services, leurs réseaux et leurs volumes dans un fichier partagé. Cela rend l'environnement plus facile à démarrer, à relire et à transmettre à un autre développeur.

Le fichier Compose ne doit toutefois pas devenir un coffre à secrets. Je fournis des noms de variables et des exemples sans identifiants réels. Pour la base, je distingue les données persistantes du conteneur lui-même ; détruire puis recréer un conteneur ne devrait pas effacer les données de travail.

## Faire de la pipeline un contrôle utile

Une pipeline simple peut exécuter, dans cet ordre, l'installation reproductible des dépendances, l'analyse statique, les tests, puis le build. Le déploiement n'arrive qu'après ces contrôles. Si une étape échoue, le retour doit indiquer quelle commande a échoué, sans exposer les secrets.

Je vérifie aussi que le service démarre réellement et répond à une vérification de santé. Un build réussi ne prouve pas qu'une connexion à la base, une variable d'environnement ou une migration fonctionne en production.

**À retenir :** un environnement reproductible rend les erreurs plus faciles à comprendre ; il ne remplace pas la vérification du système une fois déployé.

Pour aller plus loin : [Docker Compose](https://docs.docker.com/compose/).`,
    en: {
      title: "Docker Compose and CI/CD: making delivery reproducible",
      excerpt: "Using the same services and checks locally and in CI reduces environment drift.",
      content: `## Describe the application as services

A web app often depends on a database and sometimes a cache or worker. Docker Compose describes services, networks and volumes in a shared file. This makes the environment easier to start, review and hand to another developer.

A Compose file is not a secret store. Provide variable names and examples without real credentials. Keep database data in persistent storage rather than tying it to a disposable container.

## Make the pipeline useful

A simple pipeline can run reproducible dependency installation, static analysis, tests and a build, in that order. Deploy only after those checks pass. Failures should identify the failed command without printing secrets.

Also verify that the service starts and answers a health check. A successful build does not prove that database access, environment variables or migrations work in production.

**Takeaway:** reproducible environments simplify debugging, but a deployed system still needs operational checks.

Further reading: [Docker Compose](https://docs.docker.com/compose/).`,
    },
  },
  {
    slug: "securite-api-autorisation-objet",
    title: "Sécurité des APIs : contrôler l'accès à chaque objet",
    excerpt: "Être authentifié ne donne pas accès à toutes les ressources : comprendre et prévenir une faille d'autorisation fréquente.",
    tags: ["Cybersecurity", "API Security", "Authorization", "OWASP"],
    content: `## Le piège de l'identifiant

Supposons une route qui retourne une facture par son identifiant. Elle exige une session valide, mais ne vérifie pas que la facture appartient au compte courant. Un utilisateur connecté peut alors essayer un autre identifiant et obtenir une donnée qui ne lui appartient pas. OWASP classe ce problème parmi les risques majeurs des APIs : l'autorisation au niveau de l'objet.

## Une vérification complète

L'accès doit dépendre de l'identité, du rôle éventuel, de la ressource visée et de l'action demandée. La vérification s'effectue côté serveur pour chaque lecture, modification ou suppression. Dans une application multi-tenant, la requête doit aussi respecter la frontière du tenant ; cacher un bouton dans l'interface n'est pas une protection.

Je teste ce contrôle avec deux comptes distincts : le premier crée une ressource, le second tente de la lire et de la modifier. Les deux demandes doivent être refusées si aucun partage n'est prévu. Je vérifie également qu'un utilisateur ordinaire ne peut pas appeler une fonction réservée à l'administration.

Ce sujet se traite mieux lors de la conception des politiques d'accès qu'au moment d'un audit final.

Pour aller plus loin : [OWASP API Security Top 10](https://api-security.owasp.org/editions/2023/en/0x11-t10/).`,
    en: {
      title: "API security: check access to every object",
      excerpt: "Being authenticated does not grant access to every resource; understand a common authorization flaw.",
      content: `## The identifier trap

Imagine an endpoint returning an invoice by ID. It requires a valid session but never checks whether the invoice belongs to the current account. A signed-in user can try another ID and retrieve somebody else's data. OWASP lists broken object-level authorization among major API risks.

## A complete check

Access depends on identity, any role, the target resource and the requested action. Enforce the policy on the server for every read, update and deletion. In a multi-tenant application, queries must also respect the tenant boundary; hiding a button in the interface offers no protection.

Test with two separate accounts: one creates a resource, and the other tries to read and change it. Both operations should fail unless sharing is intended. Also check that regular users cannot call administrative functions.

It is easier to design access policies early than to bolt them on during a final audit.

Further reading: [OWASP API Security Top 10](https://api-security.owasp.org/editions/2023/en/0x11-t10/).`,
    },
  },
  {
    slug: "linux-nginx-deploiement-observable",
    title: "Linux, Nginx et Cloud : déployer une application que l'on peut suivre",
    excerpt: "Reverse proxy, HTTPS, logs et sauvegardes : les éléments à penser autour du code lors d'un déploiement.",
    tags: ["Linux", "Nginx", "Cloud", "Infrastructure"],
    content: `## Le déploiement dépasse le démarrage du processus

Une application qui répond sur un port local n'est pas encore un service fiable. Sur un serveur Linux, je distingue le processus applicatif, le reverse proxy, le nom de domaine, le certificat TLS et la base de données. Nginx peut recevoir les requêtes publiques et les transmettre au service applicatif ; chaque couche doit avoir une configuration compréhensible.

## Les contrôles qui comptent

- Limiter l'exposition réseau aux ports nécessaires.
- Servir le trafic public en HTTPS et prévoir le renouvellement des certificats.
- Vérifier les variables d'environnement et les permissions des fichiers.
- Centraliser des journaux utiles sans y enregistrer de secrets.
- Prévoir des sauvegardes et tester leur restauration.
- Ajouter une vérification de santé et surveiller erreurs, latence et saturation.

Je documente enfin le chemin du retour arrière : quelle version était en service, comment y revenir et quelles migrations rendent ce retour délicat. L'objectif est de pouvoir diagnostiquer un incident sans improviser sous pression.

**À retenir :** un déploiement est terminé quand l'application est accessible, observable et récupérable, pas seulement quand le build passe.

Pour aller plus loin : [guide Nginx sur le reverse proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/).`,
    en: {
      title: "Linux, Nginx and Cloud: deploying an observable application",
      excerpt: "Reverse proxy, HTTPS, logs and backups are part of delivery, not afterthoughts.",
      content: `## Deployment goes beyond starting a process

An app answering on a local port is not yet a reliable service. On a Linux server, distinguish the application process, reverse proxy, domain, TLS certificate and database. Nginx can accept public requests and forward them to the application; every layer should have a configuration the team can understand.

## Checks that matter

- Expose only the necessary network ports.
- Serve public traffic over HTTPS and plan certificate renewal.
- Check environment variables and file permissions.
- Collect useful logs without recording secrets.
- Back up data and test restoration.
- Add a health check and watch errors, latency and saturation.

Document the rollback path: which version was running, how to return to it and which migrations make a rollback difficult. The goal is to diagnose incidents without improvising under pressure.

**Takeaway:** delivery is complete when the app is reachable, observable and recoverable, not merely when its build passes.

Further reading: [Nginx reverse proxy guide](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/).`,
    },
  },
  {
    slug: "active-directory-group-policy-permissions",
    title: "Active Directory : organiser les accès avant les stratégies",
    excerpt: "OU, groupes et GPO ont des rôles différents ; bien les distinguer simplifie l'administration Windows Server.",
    tags: ["Windows Server", "Active Directory", "Group Policy", "Systems"],
    content: `## Organiser selon les besoins d'administration

Dans Active Directory, une unité d'organisation (OU) aide à structurer les objets et à définir où s'appliquent certaines stratégies de groupe. Un groupe, lui, sert notamment à attribuer des droits à plusieurs comptes. Confondre les deux conduit à des règles difficiles à maintenir.

Je commence par inventorier les rôles : qui administre les postes, qui accède à un partage et quelles restrictions concernent un ensemble de machines. Je crée ensuite des groupes nommés selon les accès, puis j'affecte les utilisateurs à ces groupes. Les permissions sont données aux groupes plutôt qu'à chaque personne individuellement.

## Appliquer une GPO avec prudence

Une stratégie de groupe a une portée : site, domaine ou OU. Avant de généraliser une restriction, je vérifie cette portée sur un petit groupe de test. Je contrôle le résultat sur un poste et un compte concernés, puis je documente l'exception éventuelle. DNS et la connectivité du domaine font aussi partie du diagnostic lorsqu'une stratégie ne s'applique pas.

**À retenir :** une arborescence claire, des groupes adaptés aux droits et des tests de portée valent mieux qu'une accumulation de règles difficiles à expliquer.

Pour aller plus loin : [Microsoft Learn — portée des GPO](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/group-policy/group-policy-scope).`,
    en: {
      title: "Active Directory: organize access before policies",
      excerpt: "OUs, groups and GPOs serve different purposes; knowing the difference simplifies Windows Server administration.",
      content: `## Organize for administration

In Active Directory, an organizational unit (OU) structures objects and helps define where some Group Policies apply. A group is commonly used to grant permissions to multiple accounts. Mixing the two creates rules that are hard to maintain.

Start by listing roles: who administers workstations, who can access a share and which restrictions apply to a set of machines. Then create groups named for their access and assign users to those groups. Grant permissions to groups rather than to every person separately.

## Apply a GPO carefully

A Group Policy has a scope: site, domain or OU. Before rolling out a restriction, check that scope with a small test group. Verify the result on affected machines and accounts, and document any exceptions. DNS and domain connectivity are also part of diagnosing a policy that does not apply.

**Takeaway:** a clear hierarchy, permission-focused groups and scope testing beat a collection of rules nobody can explain.

Further reading: [Microsoft Learn — Group Policy scope](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/group-policy/group-policy-scope).`,
    },
  },
  {
    slug: "ui-ux-accessibilite-etats-interface",
    title: "UI/UX : concevoir aussi les états invisibles sur une maquette",
    excerpt: "Une interface aboutie prévoit le chargement, l'erreur, le vide, le clavier et la réduction des animations.",
    tags: ["UI/UX", "Accessibility", "Design Systems", "Frontend"],
    content: `## Une maquette montre rarement tout le produit

Une belle page présente généralement des données parfaites. Dans l'usage réel, une liste peut être vide, une requête peut échouer et un formulaire peut contenir une erreur. Je définis ces états dès la conception pour éviter qu'ils ne deviennent des improvisations de dernière minute.

Pour chaque composant interactif, je note son état normal, survolé, focalisé, désactivé, en cours et en erreur. Un bouton de filtre indique visuellement et sémantiquement s'il est actif. Un champ de formulaire conserve un libellé visible et relie son message d'erreur au bon champ.

## Tester au-delà de la souris

Je parcours la page au clavier, vérifie l'ordre de tabulation et la visibilité du focus. Je contrôle également le contraste, la taille des cibles tactiles et les préférences de réduction des animations. Une animation peut clarifier un changement d'état, mais le contenu doit rester compréhensible lorsqu'elle est désactivée.

Le design system sert à rendre ces décisions cohérentes : couleurs, typographie, espacements et états deviennent des règles réutilisables plutôt que des exceptions par page.

Pour aller plus loin : [WCAG 2.2 du W3C](https://www.w3.org/TR/WCAG22/).`,
    en: {
      title: "UI/UX: design the states missing from the mockup",
      excerpt: "A complete interface accounts for loading, errors, empty states, keyboard access and reduced motion.",
      content: `## Mockups rarely show the whole product

A polished screen usually displays perfect data. In real use, a list can be empty, a request can fail and a form can contain mistakes. Define those states during design rather than improvising them at the end.

For each interactive component, specify its normal, hover, focus, disabled, pending and error states. A filter button should communicate whether it is selected, both visually and semantically. Form fields need visible labels and error messages associated with the correct input.

## Test beyond the mouse

Move through the page with a keyboard and check tab order and visible focus. Review contrast, touch target size and reduced-motion preferences. Animation can clarify a state change, but content must remain understandable when motion is disabled.

A design system makes these decisions consistent: color, type, spacing and states become reusable rules instead of page-by-page exceptions.

Further reading: [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/).`,
    },
  },
];

const projectConnections: Record<string, { fr: string; en: string }> = {
  "concevoir-api-rest-laravel": {
    fr: "Dans ma [plateforme e-commerce](/projects/e-commerce-platform), le catalogue, les comptes et l'administration illustrent la nécessité de séparer validation, règles métier et permissions. La [gestion scolaire](/projects/school-management-platform) pose la même question pour les rôles d'administration.",
    en: "My [e-commerce platform](/projects/e-commerce-platform) includes a catalog, accounts and administration: a concrete setting for separating validation, business rules and permissions. The [school management platform](/projects/school-management-platform) raises the same question for administrative roles.",
  },
  "react-nextjs-frontiere-serveur-client": {
    fr: "Ce portfolio en est un exemple : les projets et les articles proviennent de la base de données, tandis que les filtres, le choix de langue et le thème demandent de l'interactivité côté navigateur. Le découpage entre rendu serveur et composants clients est visible directement sur ce site.",
    en: "This portfolio is one example: projects and articles come from the database, while filters, language choice and theme need browser interactivity. The boundary between server rendering and Client Components is visible on this site.",
  },
  "react-native-expo-notifications-utiles": {
    fr: "Sur [Guidtwam](/projects/guidtwam), la configuration des notifications push Expo fait partie des travaux présentés. Pour une plateforme de transport, une confirmation et une mise à jour de trajet sont des cas qui montrent pourquoi le moment d'envoi et l'écran de destination comptent autant que l'intégration technique.",
    en: "[Guidtwam](/projects/guidtwam) includes Expo push notification configuration among the work described. For a transportation platform, confirmations and trip updates illustrate why delivery timing and the destination screen matter as much as the integration itself.",
  },
  "postgresql-indexer-requetes-reelles": {
    fr: "La fiche [FON KOUENI ERP](/projects/fon-koueni-erp) présente une architecture multi-tenant et un travail de modélisation. Elle fournit un cas concret pour réfléchir aux requêtes par tenant et aux index à mesurer, sans supposer un choix de base de données qui n'est pas documenté dans le projet.",
    en: "The [FON KOUENI ERP](/projects/fon-koueni-erp) case describes multi-tenant architecture and data modeling. It offers a concrete setting for thinking about tenant-scoped queries and indexes to measure, without assuming an undocumented database choice for that project.",
  },
  "docker-compose-pipeline-livraison": {
    fr: "Pour ce portfolio, la vérification avant livraison inclut TypeScript, lint, tests et build. Cette séquence rend les changements relisibles. Compose devient utile lorsqu'une application a plusieurs services à lancer ensemble ; il faut alors compléter la pipeline par une vérification après déploiement.",
    en: "For this portfolio, pre-delivery checks include TypeScript, lint, tests and a build. That sequence makes changes reviewable. Compose becomes useful when an application needs several services running together; the pipeline should then be complemented by post-deployment checks.",
  },
  "securite-api-autorisation-objet": {
    fr: "[Guidtwam](/projects/guidtwam) comprend un travail de sécurisation des APIs d'une plateforme de réservation. C'est le type de produit où il faut vérifier qu'un compte ne peut consulter ou modifier que les réservations auxquelles il est autorisé à accéder.",
    en: "[Guidtwam](/projects/guidtwam) includes API security work for a booking platform. This type of product needs checks ensuring that an account can only read or change bookings it is authorized to access.",
  },
  "linux-nginx-deploiement-observable": {
    fr: "La fiche [OVNI SOLUTIONS TI](/projects/ovni-solutions-ti) documente une réflexion d'architecture Cloud et sécurité. Les points de contrôle ci-dessus sont une grille à utiliser lorsque cette architecture passe de la conception à un service effectivement déployé.",
    en: "The [OVNI SOLUTIONS TI](/projects/ovni-solutions-ti) case documents Cloud and security architecture exploration. The checks above are a useful framework when such an architecture moves from design to an actually deployed service.",
  },
  "active-directory-group-policy-permissions": {
    fr: "Mon projet [IT Infrastructure](/projects/it-infrastructure) couvre Active Directory, les OU, les groupes, les GPO, DHCP et les permissions. Il illustre pourquoi une stratégie de groupe se prépare à partir d'un besoin d'accès clair et se vérifie sur les comptes et machines concernés.",
    en: "My [IT Infrastructure](/projects/it-infrastructure) project covers Active Directory, OUs, groups, GPOs, DHCP and permissions. It illustrates why Group Policy begins with clear access needs and should be verified on the affected accounts and machines.",
  },
  "ui-ux-accessibilite-etats-interface": {
    fr: "Les projets [ERS & FILS CLEANING](/projects/ers-fils-cleaning) et [IDEIA Agency](/projects/ideia-agency) portent sur la conception d'interfaces et de parcours. Ils rappellent qu'un prototype doit aussi prévoir les états de formulaire, les écrans vides et la lecture sur mobile, même lorsque la première maquette montre seulement le parcours idéal.",
    en: "[ERS & FILS CLEANING](/projects/ers-fils-cleaning) and [IDEIA Agency](/projects/ideia-agency) involve interface and user-flow design. They are reminders to cover form states, empty screens and mobile reading even when an early mockup shows only the ideal journey.",
  },
};

export const articlesContent: SeedArticle[] = baseArticlesContent.map((article) => {
  const connection = projectConnections[article.slug];
  return {
    ...article,
    content: `${article.content}\n\n## Lien avec mon travail\n\n${connection.fr}`,
    en: { ...article.en, content: `${article.en.content}\n\n## Connection to my work\n\n${connection.en}` },
  };
});
