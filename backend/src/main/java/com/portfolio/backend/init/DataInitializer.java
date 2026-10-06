package com.portfolio.backend.init;

import com.portfolio.backend.model.*;
import com.portfolio.backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ExperienceRepository experienceRepository;
    private final SkillRepository skillRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.default-username:admin}")
    private String defaultAdminUsername;

    @Value("${app.admin.default-password:admin123}")
    private String defaultAdminPassword;

    @Value("${app.admin.default-email:admin@example.com}")
    private String defaultAdminEmail;

    public DataInitializer(UserRepository userRepository,
                           ProjectRepository projectRepository,
                           ExperienceRepository experienceRepository,
                           SkillRepository skillRepository,
                           ProfileRepository profileRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.experienceRepository = experienceRepository;
        this.skillRepository = skillRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        initAdminUser();
        initProfile();
        initProjects();
        initExperiences();
        initSkills();
    }

    private void initAdminUser() {
        if (!userRepository.existsByUsername(defaultAdminUsername)) {
            User admin = new User(
                    defaultAdminUsername,
                    passwordEncoder.encode(defaultAdminPassword),
                    defaultAdminEmail,
                    "ROLE_ADMIN"
            );
            userRepository.save(admin);
            logger.info("Default admin user created: {} / {}", defaultAdminUsername, defaultAdminPassword);
        }
    }

    private void initProfile() {
        if (profileRepository.count() == 0) {
            Profile profile = new Profile();
            profile.setFullName("Harentsoa Sarobidy Harivelo");
            profile.setTitle("Full-Stack Developer & Software Engineering Student");
            profile.setSubtitle("Building the web, one commit at a time.");
            profile.setBio("I'm a Computer Science student passionate about web development and digital solutions. My focus is on building secure and scalable web applications that solve real problems.\n\nCapable of developing full-stack systems with a user-centered approach — I move comfortably between crafting clean React interfaces and architecting robust Laravel, Node.js and Spring Boot APIs.\n\nI care deeply about code quality, performance, and writing software that I'd be proud to maintain six months later.");
            profile.setCurrentStatus("Open to junior dev opportunities");
            profile.setLanguages("French · English · Malagasy");
            profile.setFocus("Full-stack web · APIs · Security · Spring Boot & React");
            profile.setLocation("Fianarantsoa · Madagascar 🇲🇬");
            profile.setEmail("hariveloharentsoasarobidy@gmail.com");
            profile.setGithubUrl("https://github.com/Cardixx");
            profile.setLinkedinUrl("https://linkedin.com/in/harentsoa-harivelo11");
            profileRepository.save(profile);
            logger.info("Portfolio profile initialized.");
        }
    }

    private void initProjects() {
        if (projectRepository.count() == 0) {
            Project p1 = new Project();
            p1.setTitle("Secure REST API");
            p1.setSubtitle("Auth & Microservice");
            p1.setDescription("JWT authentication and user management following REST best practices, with rate limiting and validation.");
            p1.setLongDescription("A production-grade RESTful API built with Spring Boot / Node.js architecture. Features include stateless JWT authentication with refresh token rotation, BCrypt password hashing, role-based authorization (RBAC), rate-limiting middleware, SQL injection prevention, input sanitization, and structured API documentation.");
            p1.setStack(Arrays.asList("Spring Boot", "Node.js", "PostgreSQL", "JWT", "Docker"));
            p1.setAccent("from-primary/30 to-accent/30");
            p1.setTag("Backend");
            p1.setYear("2024");
            p1.setFeatured(true);
            p1.setSortOrder(1);
            p1.setPresentationImageUrl("https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80");
            p1.setPresentationVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");
            p1.setGithubUrl("https://github.com/Cardixx");
            projectRepository.save(p1);

            Project p2 = new Project();
            p2.setTitle("Port Security Management Platform");
            p2.setSubtitle("SMMC Incident & Surveillance");
            p2.setDescription("Smart dashboard for managing port incidents and surveillance cameras. Secure authentication and role-based access control.");
            p2.setLongDescription("Comprehensive enterprise dashboard designed for port safety and surveillance operations at SMMC. Allows real-time incident logging, patrol dispatch tracking, dynamic camera grid feeds, and incident severity level classification. Built with clean separation of concerns and responsive design for control room operators.");
            p2.setStack(Arrays.asList("React", "Spring Boot", "PostgreSQL", "TailwindCSS", "JWT"));
            p2.setAccent("from-primary/30 to-secondary/30");
            p2.setTag("Featured");
            p2.setYear("2025");
            p2.setFeatured(true);
            p2.setSortOrder(2);
            p2.setPresentationImageUrl("https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80");
            p2.setPresentationVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
            p2.setGithubUrl("https://github.com/Cardixx");
            projectRepository.save(p2);

            Project p3 = new Project();
            p3.setTitle("SaaS Commercial Management");
            p3.setSubtitle("Stock & Sales Analytics");
            p3.setDescription("Product and stock management system with interactive analytics dashboard powered by Chart.js.");
            p3.setLongDescription("Cloud-ready commercial inventory & point-of-sale application. Supports multi-warehouse inventory movements, automated low-stock notifications, invoice generation, customer history records, and interactive business intelligence metrics for revenue forecasting.");
            p3.setStack(Arrays.asList("React", "Laravel", "Chart.js", "PostgreSQL"));
            p3.setAccent("from-accent/30 to-primary/30");
            p3.setTag("SaaS");
            p3.setYear("2024");
            p3.setFeatured(false);
            p3.setSortOrder(3);
            p3.setPresentationImageUrl("https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80");
            p3.setPresentationVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4");
            p3.setGithubUrl("https://github.com/Cardixx");
            projectRepository.save(p3);

            Project p4 = new Project();
            p4.setTitle("Intelligent Feedback Platform");
            p4.setSubtitle("NLP-Powered Student Insights");
            p4.setDescription("Automatic sentiment analysis of student feedback with an insights dashboard for teachers.");
            p4.setLongDescription("Educational technology platform applying Natural Language Processing (NLP) models to student course evaluations. Automatically detects sentiment polarity, tags recurrent themes (e.g. course pace, clarity, exercises), and generates actionable improvement summaries for teachers.");
            p4.setStack(Arrays.asList("React", "Python/NLP", "Node.js", "PostgreSQL"));
            p4.setAccent("from-secondary/30 to-accent/30");
            p4.setTag("AI / NLP");
            p4.setYear("2025");
            p4.setFeatured(false);
            p4.setSortOrder(4);
            p4.setPresentationImageUrl("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80");
            p4.setPresentationVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4");
            p4.setGithubUrl("https://github.com/Cardixx");
            projectRepository.save(p4);

            Project p5 = new Project();
            p5.setTitle("Interactive Developer Portfolio");
            p5.setSubtitle("Full-Stack Showcase");
            p5.setDescription("Immersive UI inspired by creative portfolios — modern animations, video showcases, and visitor analytics.");
            p5.setLongDescription("Personal portfolio web application showcasing full-stack capabilities with React, TypeScript, Framer Motion, and a Spring Boot + PostgreSQL backend. Features dynamic project presentation with high-res media, video demonstrations, full admin CRUD suite, and real-time visitor telemetry.");
            p5.setStack(Arrays.asList("React", "TypeScript", "Spring Boot", "PostgreSQL", "Framer Motion"));
            p5.setAccent("from-secondary/30 to-primary/30");
            p5.setTag("Design & Fullstack");
            p5.setYear("2025");
            p5.setFeatured(false);
            p5.setSortOrder(5);
            p5.setPresentationImageUrl("https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80");
            p5.setPresentationVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4");
            p5.setGithubUrl("https://github.com/Cardixx/portfolio_hsh");
            projectRepository.save(p5);

            logger.info("Initialized {} portfolio projects with image & video showcase data.", 5);
        }
    }

    private void initExperiences() {
        if (experienceRepository.count() == 0) {
            Experience e1 = new Experience();
            e1.setTitle("Full-Stack Developer (Internship)");
            e1.setCompany("Port Security Project — SMMC");
            e1.setPeriod("2025");
            e1.setDescription("Designed and built a port incident management platform with role-based access control and real-time camera monitoring. Led the React frontend and backend API integration.");
            e1.setSkills(Arrays.asList("React", "Spring Boot", "PostgreSQL", "JWT", "Team Collaboration"));
            e1.setSortOrder(1);
            experienceRepository.save(e1);

            Experience e2 = new Experience();
            e2.setTitle("Freelance Web Developer");
            e2.setCompany("SaaS & Custom Apps");
            e2.setPeriod("2024 — Present");
            e2.setDescription("Building stock-management SaaS dashboards and bespoke web applications for small businesses. Full project ownership: UML, database, API, UI, and deployment.");
            e2.setSkills(Arrays.asList("React", "Spring Boot", "PostgreSQL", "UML", "Chart.js"));
            e2.setSortOrder(2);
            experienceRepository.save(e2);

            Experience e3 = new Experience();
            e3.setTitle("Computer Science Student");
            e3.setCompany("University of Madagascar");
            e3.setPeriod("2024 — Present");
            e3.setDescription("Studying software engineering fundamentals: algorithms, databases, web architecture, and security. Active in coding clubs and hackathons.");
            e3.setSkills(Arrays.asList("Algorithms", "Data Structures", "Software Design", "Security"));
            e3.setSortOrder(3);
            experienceRepository.save(e3);

            logger.info("Initialized {} experiences.", 3);
        }
    }

    private void initSkills() {
        if (skillRepository.count() == 0) {
            List<Skill> skills = Arrays.asList(
                    // Frontend
                    new Skill("React.js", "Frontend", 1),
                    new Skill("TypeScript", "Frontend", 2),
                    new Skill("JavaScript ES6+", "Frontend", 3),
                    new Skill("HTML5 & CSS3", "Frontend", 4),
                    new Skill("TailwindCSS", "Frontend", 5),
                    new Skill("Responsive Design", "Frontend", 6),

                    // Backend
                    new Skill("Spring Boot", "Backend", 1),
                    new Skill("Java 21", "Backend", 2),
                    new Skill("Node.js", "Backend", 3),
                    new Skill("RESTful APIs", "Backend", 4),
                    new Skill("JWT Authentication", "Backend", 5),
                    new Skill("Laravel", "Backend", 6),

                    // Databases
                    new Skill("PostgreSQL", "Databases", 1),
                    new Skill("MySQL", "Databases", 2),
                    new Skill("Database Modeling", "Databases", 3),
                    new Skill("Hibernate / JPA", "Databases", 4),

                    // Tools & DevOps
                    new Skill("Git & GitHub", "Tools & DevOps", 1),
                    new Skill("Docker", "Tools & DevOps", 2),
                    new Skill("Postman", "Tools & DevOps", 3),
                    new Skill("Maven", "Tools & DevOps", 4),
                    new Skill("Linux CLI", "Tools & DevOps", 5),

                    // Other
                    new Skill("Web Security", "Other", 1),
                    new Skill("Clean Code", "Other", 2),
                    new Skill("MVC Architecture", "Other", 3),
                    new Skill("Performance Optimization", "Other", 4)
            );
            skillRepository.saveAll(skills);
            logger.info("Initialized {} skills.", skills.size());
        }
    }
}
