require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, CandidateProfile, Company, Job, Application } = require('../src/models');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hirehub');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await CandidateProfile.deleteMany({});
    await Company.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});

    console.log('Creating users...');

    // Create admin user
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@hirehub.com',
      passwordHash: adminPassword,
      role: 'admin',
      status: 'active',
    });

    // Create candidates
    const candidatePassword = await bcrypt.hash('Candidate123!', 10);
    const candidate1 = await User.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      passwordHash: candidatePassword,
      role: 'candidate',
      status: 'active',
    });

    const candidate2 = await User.create({
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      passwordHash: candidatePassword,
      role: 'candidate',
      status: 'active',
    });

    const candidate3 = await User.create({
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      passwordHash: candidatePassword,
      role: 'candidate',
      status: 'active',
    });

    // Create candidate profiles
    await CandidateProfile.create({
      user: candidate1._id,
      phone: '+1-555-0101',
      location: 'San Francisco, CA',
      bio: 'Software developer with 3 years of experience in full-stack development.',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Python'],
      education: [{
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: new Date('2016-09-01'),
        endDate: new Date('2020-05-31'),
      }],
      experience: [{
        company: 'Tech Startup Inc',
        position: 'Full Stack Developer',
        startDate: new Date('2020-06-01'),
        current: true,
        description: 'Developed and maintained web applications using React and Node.js.',
      }],
      portfolioLinks: [{
        title: 'GitHub',
        url: 'https://github.com/johndoe',
      }],
    });

    await CandidateProfile.create({
      user: candidate2._id,
      phone: '+1-555-0102',
      location: 'New York, NY',
      bio: 'UI/UX Designer with 5 years of experience creating user-centered designs.',
      skills: ['Figma', 'Adobe XD', 'Sketch', 'CSS', 'HTML'],
      education: [{
        institution: 'New York University',
        degree: 'Bachelor of Fine Arts',
        field: 'Interaction Design',
        startDate: new Date('2015-09-01'),
        endDate: new Date('2019-05-31'),
      }],
      experience: [{
        company: 'Design Agency LLC',
        position: 'Senior UI/UX Designer',
        startDate: new Date('2019-06-01'),
        current: true,
        description: 'Led design projects for enterprise clients.',
      }],
    });

    await CandidateProfile.create({
      user: candidate3._id,
      phone: '+1-555-0103',
      location: 'Austin, TX',
      bio: 'Data Scientist with expertise in machine learning and statistical analysis.',
      skills: ['Python', 'R', 'SQL', 'TensorFlow', 'PyTorch'],
      education: [{
        institution: 'University of Texas at Austin',
        degree: 'Master of Science',
        field: 'Data Science',
        startDate: new Date('2018-09-01'),
        endDate: new Date('2020-05-31'),
      }],
      experience: [{
        company: 'Data Corp',
        position: 'Data Scientist',
        startDate: new Date('2020-06-01'),
        current: true,
        description: 'Built predictive models for business intelligence.',
      }],
    });

    // Create recruiters
    const recruiterPassword = await bcrypt.hash('Recruiter123!', 10);
    const recruiter1 = await User.create({
      name: 'Sarah Williams',
      email: 'sarah.williams@techcorp.com',
      passwordHash: recruiterPassword,
      role: 'recruiter',
      status: 'active',
    });

    const recruiter2 = await User.create({
      name: 'David Brown',
      email: 'david.brown@innovate.io',
      passwordHash: recruiterPassword,
      role: 'recruiter',
      status: 'active',
    });

    // Create companies
    const company1 = await Company.create({
      recruiter: recruiter1._id,
      name: 'TechCorp Solutions',
      description: 'Leading technology company specializing in software development and cloud services.',
      website: 'https://techcorp.com',
      industry: 'Technology',
      location: 'San Francisco, CA',
      size: '201-500',
    });

    const company2 = await Company.create({
      recruiter: recruiter2._id,
      name: 'Innovate.io',
      description: 'Innovative startup building next-generation AI solutions.',
      website: 'https://innovate.io',
      industry: 'Artificial Intelligence',
      location: 'New York, NY',
      size: '51-200',
    });

    // Create jobs
    const job1 = await Job.create({
      recruiter: recruiter1._id,
      company: company1._id,
      title: 'Senior Full Stack Developer',
      description: 'We are looking for an experienced Full Stack Developer to join our team. You will be responsible for developing and maintaining web applications using modern technologies.',
      requirements: '5+ years of experience in full-stack development, proficiency in React, Node.js, and MongoDB, experience with cloud services, strong problem-solving skills.',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'AWS'],
      location: 'San Francisco, CA',
      employmentType: 'Full-time',
      experienceLevel: 'Senior',
      salaryRange: {
        min: 120000,
        max: 160000,
        currency: 'USD',
        period: 'yearly',
      },
      status: 'open',
      deadline: new Date('2025-03-31'),
    });

    const job2 = await Job.create({
      recruiter: recruiter1._id,
      company: company1._id,
      title: 'Frontend Developer',
      description: 'Join our frontend team to build beautiful and responsive user interfaces. You will work closely with designers and backend developers.',
      requirements: '3+ years of frontend development experience, strong proficiency in React and CSS, experience with modern frontend build tools, attention to detail.',
      skills: ['React', 'CSS', 'TypeScript', 'Redux'],
      location: 'Remote',
      employmentType: 'Full-time',
      experienceLevel: 'Mid-level',
      salaryRange: {
        min: 90000,
        max: 120000,
        currency: 'USD',
        period: 'yearly',
      },
      status: 'open',
      deadline: new Date('2025-04-15'),
    });

    const job3 = await Job.create({
      recruiter: recruiter2._id,
      company: company2._id,
      title: 'Machine Learning Engineer',
      description: 'We are seeking a talented Machine Learning Engineer to develop and deploy ML models at scale. You will work on cutting-edge AI projects.',
      requirements: 'Strong background in machine learning, proficiency in Python and TensorFlow/PyTorch, experience with MLOps, excellent communication skills.',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'SQL'],
      location: 'New York, NY',
      employmentType: 'Full-time',
      experienceLevel: 'Senior',
      salaryRange: {
        min: 140000,
        max: 180000,
        currency: 'USD',
        period: 'yearly',
      },
      status: 'open',
      deadline: new Date('2025-03-15'),
    });

    const job4 = await Job.create({
      recruiter: recruiter2._id,
      company: company2._id,
      title: 'UI/UX Designer',
      description: 'Create intuitive and visually appealing user experiences for our AI products. You will work closely with product and engineering teams.',
      requirements: '3+ years of UI/UX design experience, proficiency in Figma and Adobe XD, strong portfolio showcasing design process, excellent communication skills.',
      skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
      location: 'New York, NY',
      employmentType: 'Full-time',
      experienceLevel: 'Mid-level',
      salaryRange: {
        min: 85000,
        max: 110000,
        currency: 'USD',
        period: 'yearly',
      },
      status: 'open',
      deadline: new Date('2025-04-01'),
    });

    const job5 = await Job.create({
      recruiter: recruiter1._id,
      company: company1._id,
      title: 'Backend Developer Intern',
      description: 'Join our backend team as an intern and learn from experienced engineers. You will work on real projects and gain hands-on experience.',
      requirements: 'Currently pursuing a degree in Computer Science, basic knowledge of Node.js and databases, eagerness to learn, good communication skills.',
      skills: ['Node.js', 'MongoDB', 'JavaScript', 'Git'],
      location: 'San Francisco, CA',
      employmentType: 'Internship',
      experienceLevel: 'Intern',
      salaryRange: {
        min: 25,
        max: 35,
        currency: 'USD',
        period: 'hourly',
      },
      status: 'open',
      deadline: new Date('2025-05-01'),
    });

    // Create applications
    await Application.create({
      job: job1._id,
      candidate: candidate1._id,
      coverLetter: 'I am excited to apply for the Senior Full Stack Developer position. With my experience in React and Node.js, I believe I would be a great fit for your team.',
      status: 'Under Review',
    });

    await Application.create({
      job: job2._id,
      candidate: candidate1._id,
      coverLetter: 'I would love to join your frontend team. My experience with React and modern frontend tools makes me confident I can contribute effectively.',
      status: 'Applied',
    });

    await Application.create({
      job: job3._id,
      candidate: candidate3._id,
      coverLetter: 'As a data scientist with expertise in machine learning, I am excited about the opportunity to work on cutting-edge AI projects at Innovate.io.',
      status: 'Shortlisted',
    });

    await Application.create({
      job: job4._id,
      candidate: candidate2._id,
      coverLetter: 'My experience in UI/UX design and passion for creating great user experiences makes me an ideal candidate for this position.',
      status: 'Interview',
    });

    console.log('Seed data created successfully!');
    console.log('\nDemo Accounts:');
    console.log('================');
    console.log('Admin:');
    console.log('  Email: admin@hirehub.com');
    console.log('  Password: Admin123!');
    console.log('\nCandidates:');
    console.log('  Email: john.doe@example.com');
    console.log('  Password: Candidate123!');
    console.log('  Email: jane.smith@example.com');
    console.log('  Password: Candidate123!');
    console.log('  Email: mike.johnson@example.com');
    console.log('  Password: Candidate123!');
    console.log('\nRecruiters:');
    console.log('  Email: sarah.williams@techcorp.com');
    console.log('  Password: Recruiter123!');
    console.log('  Email: david.brown@innovate.io');
    console.log('  Password: Recruiter123!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run seed
connectDB().then(() => {
  seedData();
});
