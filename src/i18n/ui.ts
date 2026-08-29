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
    'nav.privacy': 'Política de privacidad',
    'nav.terms': 'Términos y condiciones',
    'nav.sitemap': 'Mapa del sitio',
    'nav.openMenu': 'Abrir menú',
    'nav.language': 'Idioma',

    'cta.quote': 'Solicitar presupuesto',
    'cta.quoteFor': 'Solicitar presupuesto para',
    'cta.seeWork': 'Ver nuestros trabajos',
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
      'Carpintería profesional y muebles a medida: closets, cocinas, gabinetes y proyectos personalizados en madera.',
    'footer.rights': 'Todos los derechos reservados.',
    'footer.honeypotLabel': 'No completar este campo',

    'home.hero.eyebrow': 'Carpintería a medida, hecha con precisión',
    'home.hero.title': 'Carpintería profesional, hecha a la medida de tu proyecto',
    'home.hero.subtitle':
      'Diseñamos y fabricamos closets, cocinas, gabinetes y muebles a medida con materiales de calidad y terminaciones profesionales. Cuéntanos tu idea y te ayudamos a construirla.',

    'home.services.eyebrow': 'Lo que hacemos',
    'home.services.title': 'Servicios de carpintería',
    'home.services.subtitle':
      'Desde el diseño hasta la instalación final: cada proyecto se adapta al espacio y necesidades reales del cliente.',

    'home.why.eyebrow': 'Por qué elegirnos',
    'home.why.title': 'Compromiso con cada detalle de tu proyecto',

    'home.how.eyebrow': 'Proceso',
    'home.how.title': 'Cómo funciona',

    'home.products.eyebrow': 'Nuestro catálogo',
    'home.products.title': 'Productos y trabajos destacados',
    'home.products.subtitle': 'Soluciones de carpintería que diseñamos y fabricamos a medida.',

    'home.portfolio.eyebrow': 'Portfolio',
    'home.portfolio.title': 'Trabajos recientes',
    'home.portfolio.subtitle': 'Proyectos reales de carpintería que hemos diseñado y fabricado.',

    'home.areas.eyebrow': 'Cobertura',
    'home.areas.title': 'Áreas donde trabajamos',

    'home.testimonials.eyebrow': 'Clientes',
    'home.testimonials.title': 'Lo que dicen quienes ya trabajaron con nosotros',

    'home.blog.eyebrow': 'Blog',
    'home.blog.title': 'Últimos artículos',
    'home.blog.subtitle': 'Guías y consejos prácticos sobre carpintería y muebles a medida.',

    'home.faq.eyebrow': 'Dudas frecuentes',
    'home.faq.title': 'Preguntas frecuentes',

    'home.finalCta.title': '¿Tienes un proyecto de carpintería en mente?',
    'home.finalCta.subtitle': 'Cuéntanos qué necesitas y te ayudamos a evaluarlo, sin compromiso.',

    'quoteCta.title': '¿Tienes un proyecto en mente?',
    'quoteCta.text': 'Cuéntanos qué necesitas y te ayudamos a darle forma, sin compromiso.',

    'form.title': 'Solicita tu presupuesto gratis',
    'form.subtitle':
      'Cuéntanos sobre tu proyecto y te contactaremos con una evaluación sin compromiso.',
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
    'form.successMessage': '¡Gracias! Hemos recibido tu solicitud y te contactaremos pronto.',
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
      'Diseñamos y fabricamos soluciones de carpintería a medida, adaptadas al espacio, estilo y presupuesto de cada proyecto.',
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
      'Una muestra de trabajos de carpintería que hemos diseñado y fabricado a medida.',
    'projects.empty': 'Todavía no hay proyectos publicados.',
    'projects.demoBadge': 'Proyecto de ejemplo',
    'projects.demoNoteFull':
      'Nota: este proyecto es contenido de ejemplo (demo) creado para mostrar la estructura de una ficha de portfolio. Debe reemplazarse por un proyecto real (o marcarse como noindex/eliminarse) antes de publicar el sitio en producción.',
    'projects.materials': 'Materiales utilizados',
    'projects.beforeAfter': 'Antes y después',
    'projects.gallery': 'Galería del proyecto',
    'projects.ctaTitle': '¿Quieres un proyecto como este?',
    'projects.ctaText': 'Cuéntanos tu idea y te damos una evaluación sin compromiso.',
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
    'contact.areas': 'Áreas de servicio',

    'about.title': 'Sobre',
    'about.ctaTitle': '¿Quieres trabajar con nosotros?',
    'about.ctaText': 'Cuéntanos tu proyecto y conversemos sobre cómo podemos ayudarte.',

    'notFound.title': 'No encontramos esa página',
    'notFound.subtitle':
      'Puede que el enlace esté roto o que la página se haya movido. Prueba con alguno de estos accesos:',

    'faq.home1.q': '¿Cómo solicito un presupuesto?',
    'faq.home1.a':
      'Completa el formulario de presupuesto, escríbenos por WhatsApp o llámanos directamente. Cuéntanos qué necesitas y te contactaremos para avanzar con la evaluación.',
    'faq.home2.q': '¿Puedo enviar fotos de mi proyecto?',
    'faq.home2.a':
      'Sí. El formulario de presupuesto permite adjuntar fotos, y también puedes enviarlas por WhatsApp o email para que tengamos más contexto de tu espacio.',
    'faq.home3.q': '¿Realizan trabajos personalizados?',
    'faq.home3.a':
      'Sí, cada proyecto se diseña a partir de las medidas, el estilo y las necesidades reales del espacio del cliente.',
    'faq.home4.q': '¿Cuánto tarda un proyecto?',
    'faq.home4.a':
      'El tiempo depende del alcance y la complejidad de cada proyecto. Te damos una estimación de tiempos durante la evaluación, antes de comenzar.',
    'faq.home5.q': '¿Qué información necesitan para cotizar?',
    'faq.home5.a':
      'Nos ayuda mucho contar con las medidas del espacio, fotos de referencia, el tipo de proyecto y cualquier idea o material que ya tengas en mente.',
    'faq.home6.q': '¿Trabajan proyectos residenciales y comerciales?',
    'faq.home6.a': 'Sí, adaptamos el servicio tanto a proyectos residenciales como comerciales.',
  },
  en: {
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.services': 'Services',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.privacy': 'Privacy Policy',
    'nav.terms': 'Terms & Conditions',
    'nav.sitemap': 'Sitemap',
    'nav.openMenu': 'Open menu',
    'nav.language': 'Language',

    'cta.quote': 'Get a Free Quote',
    'cta.quoteFor': 'Request a quote for',
    'cta.seeWork': 'See Our Work',
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
      'Professional carpentry and custom furniture: closets, kitchens, cabinets and custom woodworking projects.',
    'footer.rights': 'All rights reserved.',
    'footer.honeypotLabel': 'Do not fill out this field',

    'home.hero.eyebrow': 'Custom carpentry, built with precision',
    'home.hero.title': 'Professional carpentry, custom-built for your project',
    'home.hero.subtitle':
      'We design and build closets, kitchens, cabinets and custom furniture using quality materials and professional finishes. Tell us your idea and we’ll help you build it.',

    'home.services.eyebrow': 'What we do',
    'home.services.title': 'Carpentry Services',
    'home.services.subtitle':
      'From design to final installation: every project is tailored to the client’s real space and needs.',

    'home.why.eyebrow': 'Why choose us',
    'home.why.title': 'Committed to every detail of your project',

    'home.how.eyebrow': 'Process',
    'home.how.title': 'How it works',

    'home.products.eyebrow': 'Our catalog',
    'home.products.title': 'Featured Products & Work',
    'home.products.subtitle': 'Carpentry solutions we design and build to measure.',

    'home.portfolio.eyebrow': 'Portfolio',
    'home.portfolio.title': 'Recent Work',
    'home.portfolio.subtitle': 'Real carpentry projects we’ve designed and built.',

    'home.areas.eyebrow': 'Coverage',
    'home.areas.title': 'Areas We Serve',

    'home.testimonials.eyebrow': 'Clients',
    'home.testimonials.title': 'What people who’ve worked with us are saying',

    'home.blog.eyebrow': 'Blog',
    'home.blog.title': 'Latest Articles',
    'home.blog.subtitle': 'Practical guides and tips on carpentry and custom furniture.',

    'home.faq.eyebrow': 'Common questions',
    'home.faq.title': 'Frequently Asked Questions',

    'home.finalCta.title': 'Have a carpentry project in mind?',
    'home.finalCta.subtitle':
      "Tell us what you need and we'll help you evaluate it, no strings attached.",

    'quoteCta.title': 'Have a project in mind?',
    'quoteCta.text': "Tell us what you need and we'll help you shape it, no strings attached.",

    'form.title': 'Get Your Free Quote',
    'form.subtitle':
      "Tell us about your project and we'll get back to you with a no-obligation evaluation.",
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
    'form.successMessage': "Thanks! We've received your request and will contact you soon.",
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
      "We design and build custom carpentry solutions, tailored to each project's space, style and budget.",
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
    'projects.subtitle': 'A sample of custom carpentry work we’ve designed and built.',
    'projects.empty': "There aren't any projects published yet.",
    'projects.demoBadge': 'Example project',
    'projects.demoNoteFull':
      'Note: this project is example (demo) content created to show the structure of a portfolio entry. It should be replaced with a real project (or marked noindex/removed) before launching the site to production.',
    'projects.materials': 'Materials Used',
    'projects.beforeAfter': 'Before & After',
    'projects.gallery': 'Project Gallery',
    'projects.ctaTitle': 'Want a project like this one?',
    'projects.ctaText': "Tell us your idea and we'll give you a no-obligation evaluation.",
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
    'contact.areas': 'Service Areas',

    'about.title': 'About',
    'about.ctaTitle': 'Want to work with us?',
    'about.ctaText': "Tell us about your project and let's talk about how we can help.",

    'notFound.title': "We couldn't find that page",
    'notFound.subtitle':
      'The link may be broken or the page may have moved. Try one of these instead:',

    'faq.home1.q': 'How do I request a quote?',
    'faq.home1.a':
      "Fill out the quote form, message us on WhatsApp, or call us directly. Tell us what you need and we'll reach out to move forward with the evaluation.",
    'faq.home2.q': 'Can I send photos of my project?',
    'faq.home2.a':
      'Yes. The quote form lets you attach photos, and you can also send them via WhatsApp or email so we have more context on your space.',
    'faq.home3.q': 'Do you take on custom work?',
    'faq.home3.a':
      "Yes, every project is designed around the client's real measurements, style and space needs.",
    'faq.home4.q': 'How long does a project take?',
    'faq.home4.a':
      'It depends on the scope and complexity of each project. We give you a time estimate during the evaluation, before starting.',
    'faq.home5.q': 'What information do you need to quote a project?',
    'faq.home5.a':
      'It helps a lot to have the space measurements, reference photos, the type of project, and any ideas or materials you already have in mind.',
    'faq.home6.q': 'Do you handle residential and commercial projects?',
    'faq.home6.a': 'Yes, we adapt the service for both residential and commercial projects.',
  },
} as const;

export type UiKey = keyof (typeof ui)['es'];
