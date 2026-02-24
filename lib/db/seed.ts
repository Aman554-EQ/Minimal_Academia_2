import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(schema.upcomingEvents);
  await db.delete(schema.news);
  await db.delete(schema.publications);
  await db.delete(schema.experience);
  await db.delete(schema.education);
  await db.delete(schema.aboutParagraphs);
  await db.delete(schema.personalInfo);

  // Personal Info
  await db.insert(schema.personalInfo).values({
    name: "Mohammed Aman Bhuiyan",
    title: "AI/ML Enthusiast, CS Researcher  North South University",
    email: "mohammed.aman.nsu@gmail.com",
    githubUrl: "https://github.com/Aman554-EQ",
    githubLabel: "github.com/Aman554-EQ",
    scholarUrl: "https://scholar.google.com/citations?user=LQZXzlEAAAAJ&hl=en",
    linkedinUrl: "https://www.linkedin.com/in/mohammed-aman-bhuiyan-401bb2241",
    researchInterests: JSON.stringify([
      "Natural Language Processing",
      "Efficient LLMs & SLMs",
      "Agentic AI",
      "Computer Vision",
      "Video Understanding",
    ]),
  });

  // About paragraphs
  await db.insert(schema.aboutParagraphs).values([
    {
      content:
        "Hello, I'm Mohammed Aman Bhuiyan. I am an avid researcher in the field of AI/ML, an aspiring Machine Learning Engineer, and I am actively involved in advancing research within this domain. I graduated with a B.Sc. in Computer Science and Engineering from North South University, earning Magna Cum Laude honors. Under the supervision of Dr. Shafin Rahman, I completed my undergraduate thesis on the Anchor Transformer for Online Temporal Action Localization, where our model surpassed state-of-the-art benchmarks.",
      orderIndex: 0,
    },
    {
      content:
        "My research interests are primarily in Natural Language Processing (NLP) and Computer Vision. In NLP, I focus on optimizing language models for edge devices, building task-specific pipelines, and improving inference speed. In Computer Vision, I work on video understanding with temporal action localization, addressing limitations using Anchor Transformer, and designing optimized loss functions for class imbalance. Additionally, I have explored other important and emerging topics, including Variational Autoencoders (VAEs), Reasoning Models, Agentic AI, and Diffusion Models.",
      orderIndex: 1,
    },
  ]);

  // Education
  await db.insert(schema.education).values([
    {
      degree: "B.Sc. in Computer Science and Engineering",
      university: "North South University",
      period: "Sep 2021 - Dec 2025",
      grade: "Graduated with Academic distinction — Magna Cum Laude",
      orderIndex: 0,
    },
  ]);

  // Experience
  await db.insert(schema.experience).values([
    {
      title: "Undergraduate Teaching Assistant",
      period: "Feb 2024 - Present",
      course: "Course: CSE373[Design and Analysis of Algorithms]",
      professors:
        "Worked under Dr. Sifat Momen, Dr. Emon Kumar Dey & Dr. Sumon Ahmed.",
      orderIndex: 0,
    },
  ]);

  // Publications
  await db.insert(schema.publications).values([
    {
      title:
        "Z-Pruner: Post-Training Pruning of Large Language Models for Efficiency without Retraining",
      venue: "AICCSA-2025",
      authors:
        "Samiul Basir Bhuiyan, Md. Sazzad Hossain Adib, Mohammed Aman Bhuiyan, Muhammad Rafsan Kabir, Moshiur Farazi, Shafin Rahman, Nabeel Mohammed",
      year: 2025,
      type: "Conference",
      abstract:
        "Post-training pruning approach for Large Language Models that achieves efficiency gains without requiring any retraining or fine-tuning.",
      paperUrl: "https://www.arxiv.org/abs/2508.15828",
      codeUrl: "https://github.com/sazzadadib/Z-Pruner",
      bibtex:
        "@inproceedings{bhuiyan2025zpruner,\n  title={Z-Pruner: Post-Training Pruning of LLMs for Efficiency without Retraining},\n  year={2025}\n}",
      featured: true,
      orderIndex: 0,
    },
    {
      title:
        "TimeClip: An Online Temporal Action Localization Framework with Anchor Transformer",
      venue: "Under Review",
      authors:
        "Mohammed Aman Bhuiyan, Md. Sazzad Hossain Adib, Samiul Basir Bhuiyan, Shafin Rahman",
      year: 2025,
      type: "Conference",
      abstract:
        "An online temporal action localization framework leveraging anchor transformers for improved temporal boundary detection.",
      paperUrl: "#",
      codeUrl: "#",
      bibtex:
        "@inproceedings{bhuiyan2025timeclip,\n  title={TimeClip: An Online Temporal Action Localization Framework},\n  year={2025}\n}",
      featured: true,
      orderIndex: 1,
    },
    {
      title:
        "BanglaTLit: A Benchmark Dataset for Back-Transliteration of Romanized Bangla",
      venue: "EMNLP-2024 [Findings]",
      authors:
        "Md Fahim, Fariha Tanjim Shifat, Fabiha Haider, Deeparghya Dutta Barua, Md Sakib Ul Rahman Sourove, Md Farhan Ishmam, Farhad Alam Bhuiyan",
      year: 2024,
      type: "Conference",
      abstract:
        "This paper introduces BanglaTLit, a comprehensive benchmark dataset for back-transliteration of Romanized Bangla text.",
      paperUrl: "#",
      codeUrl: "#",
      bibtex:
        "@inproceedings{fahim2024banglatlit,\n  title={BanglaTLit},\n  booktitle={EMNLP Findings},\n  year={2024}\n}",
      featured: false,
      orderIndex: 2,
    },
    {
      title:
        "Improving the Performance of Transformer-based Models Over Classical Baselines in Hate Speech Detection",
      venue: "ICPR-2024",
      authors:
        "Mohammed Aman Bhuiyan, Fariha Tanjim Shifat, Md Fahim, Fabiha Haider",
      year: 2024,
      type: "Conference",
      abstract:
        "We propose novel transformer-based approaches that significantly outperform classical machine learning baselines in hate speech detection tasks.",
      paperUrl: "#",
      codeUrl: "#",
      bibtex:
        "@inproceedings{bhuiyan2024improving,\n  title={Improving Transformer-based Models in Hate Speech Detection},\n  booktitle={ICPR},\n  year={2024}\n}",
      featured: false,
      orderIndex: 3,
    },
    {
      title:
        "Multimodal Learning for Visual Question Answering in Low-Resource Settings",
      venue: "ECAI-2024",
      authors: "Mohammed Aman Bhuiyan, Fabiha Haider, Md Fahim",
      year: 2024,
      type: "Conference",
      abstract:
        "This work addresses the challenge of visual question answering in low-resource language settings through innovative multimodal learning approaches.",
      paperUrl: "#",
      codeUrl: "#",
      bibtex:
        "@inproceedings{bhuiyan2024multimodal,\n  title={Multimodal Learning for VQA in Low-Resource Settings},\n  booktitle={ECAI},\n  year={2024}\n}",
      featured: false,
      orderIndex: 4,
    },
    {
      title: "State Space Models for Enhanced Language Understanding",
      venue: "NAACL-2025 [Findings]",
      authors:
        "Mohammed Aman Bhuiyan, Deeparghya Dutta Barua, Fariha Tanjim Shifat",
      year: 2025,
      type: "Conference",
      abstract:
        "We explore the application of state space models in natural language understanding tasks, demonstrating significant improvements over traditional architectures.",
      paperUrl: "#",
      codeUrl: "#",
      bibtex:
        "@inproceedings{bhuiyan2025state,\n  title={State Space Models for Enhanced Language Understanding},\n  booktitle={NAACL Findings},\n  year={2025}\n}",
      featured: false,
      orderIndex: 5,
    },
  ]);

  // News
  await db.insert(schema.news).values([
    {
      date: "January 2025",
      content: "Paper accepted in NAACL 2025 - Findings",
      highlight: true,
      category: "Publication",
      orderIndex: 0,
    },
    {
      date: "December 2024",
      content: "Reviewing @ December ACL-ARR 2024",
      highlight: false,
      category: "Service",
      orderIndex: 1,
    },
    {
      date: "October 2024",
      content: "Reviewing @ October ACL-ARR 2024 [NAACL-2025]",
      highlight: false,
      category: "Service",
      orderIndex: 2,
    },
    {
      date: "September 2024",
      content: "Paper accepted in EMNLP 2024 - Findings",
      highlight: true,
      category: "Publication",
      orderIndex: 3,
    },
    {
      date: "August 2024",
      content: "Two papers have been accepted in ICPR 2024",
      highlight: true,
      category: "Publication",
      orderIndex: 4,
    },
    {
      date: "July 2024",
      content: "One paper has been accepted in ECAI 2024",
      highlight: true,
      category: "Publication",
      orderIndex: 5,
    },
    {
      date: "June 2024",
      content: "Started new research collaboration with University of Toronto",
      highlight: false,
      category: "Collaboration",
      orderIndex: 6,
    },
    {
      date: "May 2024",
      content: "Presented research at International AI Conference 2024",
      highlight: false,
      category: "Conference",
      orderIndex: 7,
    },
  ]);

  // Upcoming events
  await db.insert(schema.upcomingEvents).values([
    {
      event: "NAACL 2025 Conference",
      date: "June 2025",
      location: "Mexico City, Mexico",
      role: "Presenter",
      orderIndex: 0,
    },
    {
      event: "EMNLP 2024 Conference",
      date: "November 2024",
      location: "Miami, USA",
      role: "Presenter",
      orderIndex: 1,
    },
  ]);

  console.log("✅ Database seeded successfully!");
}

seed().catch(console.error);
