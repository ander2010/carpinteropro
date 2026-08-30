// =============================================================================
// DICCIONARIO DE TEXTOS DE INTERFAZ — ES / EN
// =============================================================================
// Toda cadena de texto que no proviene de una colección de contenido (blog,
// services, products, projects) vive aquí. Componentes compartidos (Header,
// Footer, formularios, tarjetas, etc.) reciben un `locale` y usan
// `useTranslations(locale)` en lugar de tener texto en español "quemado".
//
// El contenido (artículos, servicios, productos, proyectos) NO se traduce
// aquí: cada colección tiene sus propios archivos en `es/` y `en/` dentro de
// `src/content/**` (ver CONTENT_GUIDE.md).
// =============================================================================

export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

export const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
};

export const ui = {
  es: {
    'nav.home': 'Inicio',
    'nav.products': 'Productos',
    'nav.services': 'Servicios',
    'nav.blog': 'Blog',
    'nav.contact': 'Contacto',
    'nav.about': 'Sobre nosotros',
    'nav.projects': 'Proyectos',
    'nav.faq': 'FAQ',
    'nav.privacy': 'Política de privacidad',
    'nav.terms': 'Términos y condiciones',
    'nav.sitemap': 'Mapa del sitio',
    'nav.openMenu': 'Abrir menú',
    'nav.language': 'Idioma',

    'cta.quote': 'Contar mi proyecto',
    'cta.quoteFor': 'Cuéntanos tu proyecto de',
    'cta.seeWork': 'Ver trabajos realizados',
    'cta.viewService': 'Ver servicio',
    'cta.viewProduct': 'Ver producto',
    'cta.viewAllServices': 'Ver todos los servicios →',
    'cta.viewAllProducts': 'Ver todos los productos →',
    'cta.viewAllProjects': 'Ver todo el portfolio →',
    'cta.viewAllBlog': 'Ver todo el blog →',
    'cta.whatsapp': 'Hablar por WhatsApp',
    'cta.call': 'Llamar',
    'cta.sendRequest': 'Enviar solicitud',
    'cta.sending': 'Enviando...',
    'cta.readGuide': 'Leer guía',

    'mobilebar.call': 'Llamar',
    'mobilebar.whatsapp': 'WhatsApp',
    'mobilebar.quote': 'Presupuesto',

    'breadcrumb.home': 'Inicio',

    'pagination.previous': '← Anterior',
    'pagination.next': 'Siguiente →',
    'pagination.page': 'Página',
    'pagination.of': 'de',

    'footer.company': 'Empresa',
    'footer.services': 'Servicios',
    'footer.products': 'Productos',
    'footer.legal': 'Legal',
    'footer.areas': 'Áreas donde trabajamos',
    'footer.description':
      'Cuéntanos tu proyecto de carpintería a medida y te contacta directamente un carpintero profesional en Florida.',
    'footer.rights': 'Todos los derechos reservados.',
    'footer.honeypotLabel': 'No completar este campo',

    'home.hero.eyebrow': 'Carpintería a medida, hecha con precisión',
    'home.hero.title': 'Encuentra Carpinteros de Confianza en Florida para tu Proyecto',
    'home.hero.subtitle':
      'Cuéntanos qué necesitas — closet, cocina, mueble a medida o reparación — y conectamos tu proyecto con un carpintero profesional de la zona. Él te contacta directamente para coordinar presupuesto y detalles contigo.',

    'home.services.eyebrow': 'Lo que hacemos',
    'home.services.title': 'Conectamos tu proyecto con el carpintero adecuado',
    'home.services.subtitle':
      'Cuéntanos una sola vez qué necesitas. Nosotros compartimos tu proyecto con carpinteros profesionales del área de Florida según el tipo de trabajo, y ellos te contactan directamente para coordinar presupuesto y tiempos.',

    'home.why.eyebrow': 'Por qué usar CarpinteroPro',
    'home.why.title': 'Ahorra tiempo buscando carpintero',

    'home.how.eyebrow': 'Proceso',
    'home.how.title': 'Cómo funciona',

    'home.products.eyebrow': 'Nuestro catálogo',
    'home.products.title': 'Productos y trabajos destacados',
    'home.products.subtitle':
      'Ejemplos de soluciones de carpintería a medida realizadas por carpinteros de nuestra zona.',

    'home.portfolio.eyebrow': 'Portfolio',
    'home.portfolio.title': 'Trabajos realizados por carpinteros de nuestra zona',
    'home.portfolio.subtitle':
      'Ejemplos de proyectos de carpintería a medida realizados por profesionales con los que hemos conectado clientes.',

    'home.areas.eyebrow': 'Cobertura',
    'home.areas.title': 'Áreas donde trabajamos',

    'home.testimonials.eyebrow': 'Clientes',
    'home.testimonials.title': 'Lo que dicen quienes ya conectamos con un carpintero',

    'home.blog.eyebrow': 'Blog',
    'home.blog.title': 'Últimos artículos',
    'home.blog.subtitle': 'Guías y consejos prácticos sobre carpintería y muebles a medida.',

    'home.faq.eyebrow': 'Dudas frecuentes',
    'home.faq.title': 'Preguntas frecuentes',

    'home.finalCta.title': '¿Tienes un proyecto de carpintería en mente?',
    'home.finalCta.subtitle':
      'Cuéntanos qué necesitas y te ponemos en contacto con el carpintero adecuado de tu zona, sin compromiso.',

    'quoteCta.title': '¿Tienes un proyecto en mente?',
    'quoteCta.text':
      'Cuéntanos qué necesitas y te ponemos en contacto con un carpintero de confianza de tu zona, sin compromiso.',

    'form.title': 'Cuéntanos tu proyecto',
    'form.subtitle':
      'Compartimos tu solicitud con un carpintero profesional de tu zona, y él te contactará directamente para coordinar presupuesto y detalles.',
    'form.name': 'Nombre',
    'form.phone': 'Teléfono',
    'form.email': 'Email',
    'form.projectType': 'Tipo de proyecto',
    'form.projectTypeSelect': 'Selecciona una opción',
    'form.location': 'Ubicación / código postal',
    'form.date': 'Fecha aproximada (opcional)',
    'form.budget': 'Presupuesto estimado (opcional)',
    'form.budgetPlaceholder': 'Ej. $1,000 - $3,000',
    'form.description': 'Cuéntanos tu proyecto',
    'form.descriptionPlaceholder': 'Medidas, materiales, ideas, referencias...',
    'form.photos': 'Fotos del proyecto (opcional)',
    'form.preferredContact': 'Método de contacto preferido',
    'form.consent': 'Acepto ser contactado sobre mi solicitud.',
    'form.successMessage':
      '¡Gracias! Hemos recibido tu solicitud. Un carpintero de nuestra zona se pondrá en contacto contigo pronto.',
    'form.whatsappRedirect': 'Te llevamos a WhatsApp para completar el envío de tu solicitud.',
    'form.emailRedirect': 'Abrimos tu cliente de email para completar el envío.',
    'form.noChannel':
      'El sitio todavía no tiene un canal de contacto configurado. Por favor, inténtalo más tarde.',
    'form.errorMessage':
      'No pudimos enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo, o contáctanos directamente.',
    'form.projectTypes':
      'Cocina,Closet,Gabinetes,Muebles a medida,Puertas,Reparación de madera,Remodelación,Otro',
    'form.contactMethods': 'WhatsApp,Llamada,Email',

    'blog.title': 'Blog de carpintería',
    'blog.subtitle':
      'Guías prácticas, consejos y proyectos reales sobre carpintería y muebles a medida.',
    'blog.readingTime': 'min de lectura',
    'blog.updated': 'Actualizado el',
    'blog.share': 'Compartir:',
    'blog.previousPost': '← Artículo anterior',
    'blog.nextPost': 'Siguiente artículo →',
    'blog.relatedServices': 'Servicios relacionados',
    'blog.relatedProducts': 'Productos relacionados',
    'blog.relatedPosts': 'Artículos relacionados',
    'blog.empty': 'Todavía no hay artículos publicados. Vuelve pronto.',
    'blog.emptyCategory': 'Todavía no hay artículos en esta categoría.',
    'blog.inThisArticle': 'En este artículo',
    'blog.demoNote':
      'Este proyecto es contenido de ejemplo (demo) creado para mostrar la estructura de una ficha de portfolio.',

    'services.title': 'Servicios de carpintería',
    'services.subtitle':
      'Cuéntanos tu proyecto y te contacta un carpintero de nuestra zona especializado en el tipo de trabajo que necesitas.',
    'services.empty': 'Todavía no hay servicios publicados.',
    'services.benefits': 'Beneficios de este servicio',
    'services.process': 'Cómo trabajamos este servicio',
    'services.gallery': 'Galería',
    'services.relatedProjects': 'Proyectos relacionados',
    'services.relatedProducts': 'Productos relacionados',
    'services.faq': 'Preguntas frecuentes',
    'services.relatedPosts': 'Artículos relacionados',
    'services.otherServices': 'Otros servicios',

    'products.title': 'Productos de carpintería',
    'products.subtitle':
      'Cada producto se fabrica a medida según el espacio y las necesidades de tu proyecto.',
    'products.empty': 'Todavía no hay productos publicados.',
    'products.all': 'Todos',
    'products.features': 'Características',
    'products.materials': 'Materiales disponibles',
    'products.useCases': 'Ideal para',
    'products.gallery': 'Galería',
    'products.relatedService': 'Servicio relacionado',
    'products.faq': 'Preguntas frecuentes',
    'products.relatedPosts': 'Artículos relacionados',
    'products.similar': 'Productos similares',

    'projects.title': 'Proyectos y portfolio',
    'projects.subtitle':
      'Una muestra de trabajos de carpintería a medida realizados por profesionales con los que hemos conectado clientes.',
    'projects.empty': 'Todavía no hay proyectos publicados.',
    'projects.demoBadge': 'Proyecto de ejemplo',
    'projects.demoNoteFull':
      'Nota: este proyecto es contenido de ejemplo (demo) creado para mostrar la estructura de una ficha de portfolio. Debe reemplazarse por un proyecto real (o marcarse como noindex/eliminarse) antes de publicar el sitio en producción.',
    'projects.materials': 'Materiales utilizados',
    'projects.beforeAfter': 'Antes y después',
    'projects.gallery': 'Galería del proyecto',
    'projects.ctaTitle': '¿Quieres un proyecto como este?',
    'projects.ctaText':
      'Cuéntanos tu idea y te ponemos en contacto con el carpintero adecuado, sin compromiso.',
    'projects.moreProjects': 'Más proyectos',
    'projects.serviceUsed': 'Servicio utilizado',
    'projects.before': 'Antes',
    'projects.after': 'Después',

    'contact.title': 'Hablemos de tu proyecto',
    'contact.subtitle':
      'Completa el formulario con los detalles de tu proyecto y te contactaremos para avanzar con una evaluación. También puedes escribirnos directamente.',
    'contact.formTitle': 'Solicitar presupuesto',
    'contact.formSubtitle': 'Cuanta más información nos des, más precisa será nuestra evaluación.',
    'contact.noInfoYet':
      'Todavía no se han configurado datos de contacto directo (teléfono, WhatsApp, email, dirección u horarios). Complétalos en src/config/business.ts y aparecerán aquí automáticamente.',
    'contact.email': 'Email',
    'contact.address': 'Dirección',
    'contact.hours': 'Horario',
    'contact.open24': 'Abiertos las 24 horas, todos los días',
    'contact.areas': 'Áreas de servicio',

    'about.title': 'Sobre',
    'about.ctaTitle': '¿Quieres trabajar con nosotros?',
    'about.ctaText': 'Cuéntanos tu proyecto y conversemos sobre cómo podemos ayudarte.',

    'notFound.title': 'No encontramos esa página',
    'notFound.subtitle':
      'Puede que el enlace esté roto o que la página se haya movido. Prueba con alguno de estos accesos:',

    'faq.home1.q': '¿Contarles mi proyecto tiene algún costo?',
    'faq.home1.a':
      'No. Contarnos tu proyecto por el formulario o WhatsApp es completamente gratis, no pagas nada por que te contacte un carpintero.',
    'faq.home2.q': '¿Quién hace el trabajo, CarpinteroPro o un tercero?',
    'faq.home2.a':
      'El carpintero que te contacte. Nosotros solo conectamos tu proyecto con profesionales de confianza de la zona; el trabajo lo realiza el carpintero directamente.',
    'faq.home3.q': '¿Quién define el presupuesto?',
    'faq.home3.a':
      'El presupuesto y los detalles del proyecto los acuerdas directamente con el carpintero que te contacte, no con CarpinteroPro.',
    'faq.home4.q': '¿Puede contactarme más de un carpintero por el mismo proyecto?',
    'faq.home4.a':
      'Sí, según disponibilidad. Así puedes comparar antes de decidir con quién trabajar.',
    'faq.home5.q': '¿Cómo solicito un presupuesto?',
    'faq.home5.a':
      'Completa el formulario o escríbenos por WhatsApp contándonos tu proyecto. Compartimos tu solicitud con el carpintero adecuado y él te contacta directamente para darte el presupuesto.',
    'faq.home6.q': '¿Puedo enviar fotos de mi proyecto?',
    'faq.home6.a':
      'Sí, mientras más detalles y fotos compartas del espacio, más rápido y preciso será el contacto del carpintero.',
    'faq.home7.q': '¿Qué información necesitan para conectar mi proyecto con un carpintero?',
    'faq.home7.a':
      'El tipo de trabajo (closet, cocina, mueble, reparación, etc.), medidas aproximadas del espacio, fotos de referencia si las tienes, y tu zona o ciudad.',
    'faq.home8.q': '¿Cuánto tarda un proyecto?',
    'faq.home8.a':
      'Los tiempos de fabricación e instalación los define el carpintero según la complejidad de tu proyecto; te los confirmará directamente al contactarte.',
    'faq.home9.q': '¿Trabajan proyectos residenciales y comerciales?',
    'faq.home9.a':
      'Sí, conectamos tanto proyectos residenciales como comerciales con el carpintero adecuado.',
    'faq.home10.q': '¿El trabajo tiene garantía?',
    'faq.home10.a':
      'La garantía del trabajo la ofrece directamente el carpintero que lo realiza; te recomendamos confirmarla con él antes de acordar el proyecto.',
    'faq.home11.q': '¿En qué zonas tienen carpinteros disponibles?',
    'faq.home11.a': 'Actualmente conectamos proyectos en el área de Florida.',
    'faq.home12.q': '¿Estoy obligado a contratar al carpintero que me contacte?',
    'faq.home12.a':
      'No. Contarnos tu proyecto no te obliga a nada — decides con quién trabajar o si prefieres no continuar.',
  },
  en: {
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.services': 'Services',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.faq': 'FAQ',
    'nav.privacy': 'Privacy Policy',
    'nav.terms': 'Terms & Conditions',
    'nav.sitemap': 'Sitemap',
    'nav.openMenu': 'Open menu',
    'nav.language': 'Language',

    'cta.quote': 'Tell Us Your Project',
    'cta.quoteFor': 'Tell us about your project for',
    'cta.seeWork': 'See Completed Work',
    'cta.viewService': 'View service',
    'cta.viewProduct': 'View product',
    'cta.viewAllServices': 'View all services →',
    'cta.viewAllProducts': 'View all products →',
    'cta.viewAllProjects': 'View full portfolio →',
    'cta.viewAllBlog': 'View all articles →',
    'cta.whatsapp': 'Chat on WhatsApp',
    'cta.call': 'Call',
    'cta.sendRequest': 'Send request',
    'cta.sending': 'Sending...',
    'cta.readGuide': 'Read guide',

    'mobilebar.call': 'Call',
    'mobilebar.whatsapp': 'WhatsApp',
    'mobilebar.quote': 'Get Quote',

    'breadcrumb.home': 'Home',

    'pagination.previous': '← Previous',
    'pagination.next': 'Next →',
    'pagination.page': 'Page',
    'pagination.of': 'of',

    'footer.company': 'Company',
    'footer.services': 'Services',
    'footer.products': 'Products',
    'footer.legal': 'Legal',
    'footer.areas': 'Areas We Serve',
    'footer.description':
      'Tell us about your custom carpentry project and a professional carpenter in Florida will contact you directly.',
    'footer.rights': 'All rights reserved.',
    'footer.honeypotLabel': 'Do not fill out this field',

    'home.hero.eyebrow': 'Custom carpentry, built with precision',
    'home.hero.title': 'Find Trusted Carpenters in Florida for Your Project',
    'home.hero.subtitle':
      "Tell us what you need — closet, kitchen, custom furniture or repair — and we'll connect your project with a professional carpenter in your area. They'll contact you directly to coordinate pricing and details.",

    'home.services.eyebrow': 'What we do',
    'home.services.title': 'We connect your project with the right carpenter',
    'home.services.subtitle':
      'Tell us what you need once. We share your project with professional carpenters across Florida based on the type of work, and they contact you directly to coordinate pricing and timing.',

    'home.why.eyebrow': 'Why use CarpinteroPro',
    'home.why.title': 'Save time searching for a carpenter',

    'home.how.eyebrow': 'Process',
    'home.how.title': 'How it works',

    'home.products.eyebrow': 'Our catalog',
    'home.products.title': 'Featured Products & Work',
    'home.products.subtitle':
      'Examples of custom carpentry solutions built by carpenters in our area.',

    'home.portfolio.eyebrow': 'Portfolio',
    'home.portfolio.title': 'Work completed by carpenters in our area',
    'home.portfolio.subtitle':
      "Examples of custom carpentry projects completed by professionals we've connected with clients.",

    'home.areas.eyebrow': 'Coverage',
    'home.areas.title': 'Areas We Serve',

    'home.testimonials.eyebrow': 'Clients',
    'home.testimonials.title': "What people we've connected with a carpenter are saying",

    'home.blog.eyebrow': 'Blog',
    'home.blog.title': 'Latest Articles',
    'home.blog.subtitle': 'Practical guides and tips on carpentry and custom furniture.',

    'home.faq.eyebrow': 'Common questions',
    'home.faq.title': 'Frequently Asked Questions',

    'home.finalCta.title': 'Have a carpentry project in mind?',
    'home.finalCta.subtitle':
      "Tell us what you need and we'll connect you with the right carpenter in your area, no strings attached.",

    'quoteCta.title': 'Have a project in mind?',
    'quoteCta.text':
      "Tell us what you need and we'll connect you with a trusted carpenter in your area, no strings attached.",

    'form.title': 'Tell Us About Your Project',
    'form.subtitle':
      "We'll share your request with a professional carpenter in your area, and they'll contact you directly to coordinate pricing and details.",
    'form.name': 'Name',
    'form.phone': 'Phone',
    'form.email': 'Email',
    'form.projectType': 'Project type',
    'form.projectTypeSelect': 'Select an option',
    'form.location': 'Location / ZIP code',
    'form.date': 'Approximate date (optional)',
    'form.budget': 'Estimated budget (optional)',
    'form.budgetPlaceholder': 'E.g. $1,000 - $3,000',
    'form.description': 'Tell us about your project',
    'form.descriptionPlaceholder': 'Measurements, materials, ideas, references...',
    'form.photos': 'Project photos (optional)',
    'form.preferredContact': 'Preferred contact method',
    'form.consent': 'I agree to be contacted about my request.',
    'form.successMessage':
      "Thanks! We've received your request. A carpenter in our area will reach out to you soon.",
    'form.whatsappRedirect': "We're taking you to WhatsApp to complete your request.",
    'form.emailRedirect': 'We’re opening your email client to complete your request.',
    'form.noChannel':
      "The site doesn't have a contact channel configured yet. Please try again later.",
    'form.errorMessage':
      "We couldn't send your request. Check your connection and try again, or contact us directly.",
    'form.projectTypes':
      'Kitchen,Closet,Cabinets,Custom furniture,Doors,Wood repair,Remodeling,Other',
    'form.contactMethods': 'WhatsApp,Call,Email',

    'blog.title': 'Carpentry Blog',
    'blog.subtitle':
      'Practical guides, tips and real projects about carpentry and custom furniture.',
    'blog.readingTime': 'min read',
    'blog.updated': 'Updated on',
    'blog.share': 'Share:',
    'blog.previousPost': '← Previous article',
    'blog.nextPost': 'Next article →',
    'blog.relatedServices': 'Related Services',
    'blog.relatedProducts': 'Related Products',
    'blog.relatedPosts': 'Related Articles',
    'blog.empty': "There aren't any articles published yet. Check back soon.",
    'blog.emptyCategory': "There aren't any articles in this category yet.",
    'blog.inThisArticle': 'In this article',
    'blog.demoNote':
      'This project is example (demo) content created to show the structure of a portfolio entry.',

    'services.title': 'Carpentry Services',
    'services.subtitle':
      'Tell us about your project and a carpenter in our area who specializes in that type of work will contact you.',
    'services.empty': "There aren't any services published yet.",
    'services.benefits': 'Benefits of this service',
    'services.process': 'How we handle this service',
    'services.gallery': 'Gallery',
    'services.relatedProjects': 'Related Projects',
    'services.relatedProducts': 'Related Products',
    'services.faq': 'Frequently Asked Questions',
    'services.relatedPosts': 'Related Articles',
    'services.otherServices': 'Other Services',

    'products.title': 'Carpentry Products',
    'products.subtitle': "Every product is custom-built to fit your project's space and needs.",
    'products.empty': "There aren't any products published yet.",
    'products.all': 'All',
    'products.features': 'Features',
    'products.materials': 'Available Materials',
    'products.useCases': 'Great for',
    'products.gallery': 'Gallery',
    'products.relatedService': 'Related Service',
    'products.faq': 'Frequently Asked Questions',
    'products.relatedPosts': 'Related Articles',
    'products.similar': 'Similar Products',

    'projects.title': 'Projects & Portfolio',
    'projects.subtitle':
      "A sample of custom carpentry work completed by professionals we've connected with clients.",
    'projects.empty': "There aren't any projects published yet.",
    'projects.demoBadge': 'Example project',
    'projects.demoNoteFull':
      'Note: this project is example (demo) content created to show the structure of a portfolio entry. It should be replaced with a real project (or marked noindex/removed) before launching the site to production.',
    'projects.materials': 'Materials Used',
    'projects.beforeAfter': 'Before & After',
    'projects.gallery': 'Project Gallery',
    'projects.ctaTitle': 'Want a project like this one?',
    'projects.ctaText':
      "Tell us your idea and we'll connect you with the right carpenter, no strings attached.",
    'projects.moreProjects': 'More Projects',
    'projects.serviceUsed': 'Service Used',
    'projects.before': 'Before',
    'projects.after': 'After',

    'contact.title': "Let's talk about your project",
    'contact.subtitle':
      "Fill out the form with your project details and we'll reach out to move forward with an evaluation. You can also write to us directly.",
    'contact.formTitle': 'Request a Quote',
    'contact.formSubtitle': 'The more details you share, the more accurate our evaluation will be.',
    'contact.noInfoYet':
      "Direct contact details (phone, WhatsApp, email, address or hours) haven't been configured yet. Fill them in at src/config/business.ts and they'll show up here automatically.",
    'contact.email': 'Email',
    'contact.address': 'Address',
    'contact.hours': 'Hours',
    'contact.open24': 'Open 24 hours, every day',
    'contact.areas': 'Service Areas',

    'about.title': 'About',
    'about.ctaTitle': 'Want to work with us?',
    'about.ctaText': "Tell us about your project and let's talk about how we can help.",

    'notFound.title': "We couldn't find that page",
    'notFound.subtitle':
      'The link may be broken or the page may have moved. Try one of these instead:',

    'faq.home1.q': 'Does telling you about my project cost anything?',
    'faq.home1.a':
      "No. Telling us about your project through the form or WhatsApp is completely free — you don't pay anything for a carpenter to contact you.",
    'faq.home2.q': 'Who does the work, CarpinteroPro or someone else?',
    'faq.home2.a':
      'The carpenter who contacts you. We only connect your project with trusted local professionals; the carpenter carries out the work directly.',
    'faq.home3.q': 'Who sets the price?',
    'faq.home3.a':
      'You agree on the price and project details directly with the carpenter who contacts you, not with CarpinteroPro.',
    'faq.home4.q': 'Can more than one carpenter contact me about the same project?',
    'faq.home4.a':
      'Yes, depending on availability. That way you can compare before deciding who to work with.',
    'faq.home5.q': 'How do I request a quote?',
    'faq.home5.a':
      "Fill out the form or message us on WhatsApp telling us about your project. We share your request with the right carpenter, and they'll contact you directly to give you a quote.",
    'faq.home6.q': 'Can I send photos of my project?',
    'faq.home6.a':
      'Yes — the more details and photos you share of the space, the faster and more accurate the carpenter contacting you will be.',
    'faq.home7.q': 'What information do you need to connect my project with a carpenter?',
    'faq.home7.a':
      'The type of work (closet, kitchen, furniture, repair, etc.), approximate space measurements, reference photos if you have them, and your area or city.',
    'faq.home8.q': 'How long does a project take?',
    'faq.home8.a':
      "The carpenter sets the fabrication and installation timeline based on your project's complexity, and will confirm it directly when they contact you.",
    'faq.home9.q': 'Do you handle residential and commercial projects?',
    'faq.home9.a':
      'Yes, we connect both residential and commercial projects with the right carpenter.',
    'faq.home10.q': 'Is the work guaranteed?',
    'faq.home10.a':
      'The warranty on the work is offered directly by the carpenter who does it; we recommend confirming it with them before agreeing to the project.',
    'faq.home11.q': 'What areas do you have carpenters available in?',
    'faq.home11.a': 'We currently connect projects in the Florida area.',
    'faq.home12.q': 'Am I obligated to hire the carpenter who contacts me?',
    'faq.home12.a':
      "No. Telling us about your project doesn't obligate you to anything — you decide who to work with, or whether to move forward at all.",
  },
} as const;

export type UiKey = keyof (typeof ui)['es'];
