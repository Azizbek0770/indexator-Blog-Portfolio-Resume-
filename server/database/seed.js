import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { supabase } from './supabase.js';

dotenv.config();

const insertStrict = async (table, payload) => {
  const { data, error } = await supabase.from(table).insert(payload).select();
  if (error) throw new Error(`${table} insert failed: ${error.message}`);
  return data;
};

const seedDatabase = async () => {
  console.log('🌱 Starting database seeding...');

  try {
    const { data: settingsCheck, error: connError } = await supabase
      .from('settings')
      .select('id')
      .limit(1);
    if (connError) throw new Error(`Connection check failed: ${connError.message}`);

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Ajiko27000027@@', 10);
    try {
      await insertStrict('users', [{
        email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
        password_hash: hashedPassword,
        role: 'admin'
      }]);
      console.log('✅ Admin user created');
    } catch (e) {
      console.log(`Admin user insert skipped: ${e.message}`);
    }

    await insertStrict('hero', [{
      title: 'Full Stack Developer',
      slogan: 'Building amazing digital experiences with modern technologies',
      avatar_url: 'https://via.placeholder.com/400',
      cta_primary_text: 'Contact Me',
      cta_primary_link: '#contact',
      cta_secondary_text: 'Download Resume',
      cta_secondary_link: '/resume.pdf'
    }]);
    console.log('✅ Hero section seeded');

    await insertStrict('about', [{
      bio: 'I am a passionate full-stack developer with expertise in building scalable web applications. With a strong foundation in both frontend and backend technologies, I create seamless user experiences backed by robust architecture.',
      mission: 'To leverage technology to solve real-world problems and create innovative solutions that make a positive impact.',
      languages: ['English', 'Spanish', 'French'],
      years_experience: 5,
      completed_projects: 50,
      happy_clients: 30
    }]);
    console.log('✅ About section seeded');

    const skills = [
      { category: 'Frontend', name: 'React', level: 95, icon: 'react' },
      { category: 'Frontend', name: 'Vue.js', level: 85, icon: 'vue' },
      { category: 'Frontend', name: 'TypeScript', level: 90, icon: 'typescript' },
      { category: 'Frontend', name: 'Tailwind CSS', level: 95, icon: 'tailwind' },
      { category: 'Backend', name: 'Node.js', level: 90, icon: 'nodejs' },
      { category: 'Backend', name: 'Express', level: 90, icon: 'express' },
      { category: 'Backend', name: 'Python', level: 85, icon: 'python' },
      { category: 'Backend', name: 'PostgreSQL', level: 85, icon: 'postgresql' },
      { category: 'DevOps', name: 'Docker', level: 80, icon: 'docker' },
      { category: 'DevOps', name: 'AWS', level: 75, icon: 'aws' },
      { category: 'DevOps', name: 'CI/CD', level: 80, icon: 'github' }
    ];
    await insertStrict('skills', skills);
    console.log('✅ Skills seeded');

    const experience = [
      {
        title: 'Senior Full Stack Developer',
        company: 'Tech Innovations Inc',
        start_date: '2021-01-15',
        end_date: null,
        current: true,
        description: 'Leading development of enterprise web applications using React, Node.js, and PostgreSQL. Mentoring junior developers and implementing best practices.',
        location: 'Remote'
      },
      {
        title: 'Full Stack Developer',
        company: 'Digital Solutions Ltd',
        start_date: '2019-06-01',
        end_date: '2020-12-31',
        current: false,
        description: 'Developed and maintained multiple client projects. Implemented RESTful APIs and responsive frontend interfaces.',
        location: 'New York, NY'
      },
      {
        title: 'Junior Developer',
        company: 'StartUp Hub',
        start_date: '2018-03-01',
        end_date: '2019-05-31',
        current: false,
        description: 'Assisted in building web applications and learned modern development practices.',
        location: 'San Francisco, CA'
      }
    ];
    await insertStrict('experience', experience);
    console.log('✅ Experience seeded');

    const education = [
      {
        school: 'University of Technology',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        start_date: '2014-09-01',
        end_date: '2018-05-31',
        current: false,
        description: 'Focused on software engineering, algorithms, and data structures.',
        gpa: '3.8'
      }
    ];
    await insertStrict('education', education);
    console.log('✅ Education seeded');

    const certificates = [
      {
        name: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        issue_date: '2022-08-15',
        credential_id: 'AWS-123456',
        credential_url: 'https://aws.amazon.com/verification',
        image_url: 'https://via.placeholder.com/300x200'
      },
      {
        name: 'React Advanced Certification',
        issuer: 'Meta',
        issue_date: '2023-03-20',
        credential_id: 'META-789012',
        credential_url: 'https://meta.com/verification',
        image_url: 'https://via.placeholder.com/300x200'
      }
    ];
    await insertStrict('certificates', certificates);
    console.log('✅ Certificates seeded');

    const projects = [
      {
        title: 'E-Commerce Platform',
        description: 'Full-featured online shopping platform with payment integration',
        detailed_description: 'Built a comprehensive e-commerce solution with product management, shopping cart, secure checkout, and admin dashboard. Integrated Stripe for payments and implemented real-time inventory tracking.',
        tech_stack: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redis'],
        image_url: 'https://via.placeholder.com/800x600',
        demo_url: 'https://demo.example.com',
        code_url: 'https://github.com/example/ecommerce',
        featured: true
      },
      {
        title: 'Task Management App',
        description: 'Collaborative task management with real-time updates',
        detailed_description: 'Developed a Trello-like task management application with drag-and-drop functionality, real-time collaboration using WebSockets, and team management features.',
        tech_stack: ['Vue.js', 'Express', 'PostgreSQL', 'WebSocket'],
        image_url: 'https://via.placeholder.com/800x600',
        demo_url: 'https://demo.example.com',
        code_url: 'https://github.com/example/taskapp',
        featured: true
      },
      {
        title: 'Social Media Dashboard',
        description: 'Analytics dashboard for social media management',
        detailed_description: 'Created a comprehensive analytics dashboard that aggregates data from multiple social media platforms, providing insights and scheduling capabilities.',
        tech_stack: ['React', 'Python', 'FastAPI', 'Chart.js'],
        image_url: 'https://via.placeholder.com/800x600',
        demo_url: 'https://demo.example.com',
        code_url: 'https://github.com/example/social-dashboard',
        featured: false
      }
    ];
    await insertStrict('projects', projects);
    console.log('✅ Projects seeded');

    const services = [
      {
        title: 'Web Development',
        description: 'Custom web applications built with modern frameworks and best practices. From concept to deployment, I create scalable and maintainable solutions.',
        icon: 'code',
        sort_order: 1
      },
      {
        title: 'UI/UX Design',
        description: 'Beautiful, intuitive user interfaces that provide exceptional user experiences. Focus on accessibility and responsive design.',
        icon: 'palette',
        sort_order: 2
      },
      {
        title: 'API Development',
        description: 'RESTful and GraphQL APIs designed for performance and security. Complete documentation and testing included.',
        icon: 'api',
        sort_order: 3
      },
      {
        title: 'DevOps & Deployment',
        description: 'CI/CD pipelines, containerization, and cloud deployment. Ensuring your application runs smoothly in production.',
        icon: 'server',
        sort_order: 4
      }
    ];
    await insertStrict('services', services);
    console.log('✅ Services seeded');

    const testimonials = [
      {
        author: 'John Smith',
        role: 'CEO',
        company: 'Tech Startup Inc',
        text: 'Outstanding work! The project was delivered on time and exceeded our expectations. Highly recommend for any web development needs.',
        image_url: 'https://via.placeholder.com/150',
        rating: 5,
        featured: true
      },
      {
        author: 'Sarah Johnson',
        role: 'Product Manager',
        company: 'Digital Agency',
        text: 'Professional, responsive, and technically skilled. A pleasure to work with and the results speak for themselves.',
        image_url: 'https://via.placeholder.com/150',
        rating: 5,
        featured: true
      },
      {
        author: 'Michael Brown',
        role: 'CTO',
        company: 'Enterprise Solutions',
        text: 'Excellent problem-solving skills and deep technical knowledge. Delivered a complex project with grace and efficiency.',
        image_url: 'https://via.placeholder.com/150',
        rating: 5,
        featured: false
      }
    ];
    await insertStrict('testimonials', testimonials);
    console.log('✅ Testimonials seeded');

    const categories = [
      { name: 'Web Development', slug: 'web-development' },
      { name: 'JavaScript', slug: 'javascript' },
      { name: 'React', slug: 'react' },
      { name: 'Career', slug: 'career' },
      { name: 'Tutorial', slug: 'tutorial' }
    ];
    const insertedCategories = await insertStrict('blog_categories', categories);
    console.log('✅ Blog categories seeded');

    if (insertedCategories && insertedCategories.length > 0) {
      const posts = [
        {
          title: 'Getting Started with React Hooks',
          slug: 'getting-started-react-hooks',
          content: '<h2>Introduction</h2><p>React Hooks have revolutionized how we write React components. In this comprehensive guide, we will explore the most commonly used hooks and how to leverage them effectively...</p><h2>useState Hook</h2><p>The useState hook allows you to add state to functional components...</p>',
          excerpt: 'Learn how to use React Hooks effectively in your applications.',
          category_id: insertedCategories[2].id,
          image_url: 'https://via.placeholder.com/800x400',
          published: true
        },
        {
          title: 'Building RESTful APIs with Node.js',
          slug: 'building-restful-apis-nodejs',
          content: '<h2>Why Node.js?</h2><p>Node.js has become the go-to platform for building scalable APIs. In this tutorial, we will build a complete RESTful API from scratch...</p>',
          excerpt: 'A complete guide to creating robust APIs with Node.js and Express.',
          category_id: insertedCategories[0].id,
          image_url: 'https://via.placeholder.com/800x400',
          published: true
        },
        {
          title: 'My Journey as a Self-Taught Developer',
          slug: 'journey-self-taught-developer',
          content: '<h2>The Beginning</h2><p>Five years ago, I wrote my first line of code. Here is my story of becoming a professional developer...</p>',
          excerpt: 'Personal reflections on learning to code and breaking into tech.',
          category_id: insertedCategories[3].id,
          image_url: 'https://via.placeholder.com/800x400',
          published: true
        }
      ];
      await insertStrict('blog_posts', posts);
      console.log('✅ Blog posts seeded');
    }

    const messages = [
      {
        name: 'Alice Williams',
        email: 'alice@example.com',
        subject: 'Project Inquiry',
        message: 'Hi! I am interested in discussing a potential project. Could we schedule a call?',
        read: false
      }
    ];
    await insertStrict('messages', messages);
    console.log('✅ Sample messages seeded');

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error.message || error);
    process.exit(1);
  }
};

seedDatabase();
