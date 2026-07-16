export interface JobDetail {
  meta: { label: string; value: string }[];
  summary: string;
  sections: { heading: string; items?: string[]; body?: string }[];
}

export const JOB_DESCRIPTIONS: Record<string, JobDetail> = {
  'Summer Intern': {
    meta: [
      { label: 'FLSA Classification', value: 'Non-Exempt (Unpaid Internship / Trainee)' },
      { label: 'Full / Part-Time', value: 'Part-time (Internship)' },
      { label: 'Pay Range', value: 'Unpaid – Academic Credit Eligible; Guaranteed Letter of Recommendation upon completion' },
      { label: 'Reports To', value: 'Founders / Owners (Agnes & Michal)' },
    ],
    summary:
      'The Summer Intern at Klawsome! supports the Founders in day-to-day business operations and growth initiatives. This role offers first-hand experience working on an innovative startup — the first stand-alone claw machine arcade in Michigan — with direct mentorship from the Founders.',
    sections: [
      {
        heading: 'Essential Functions',
        items: [
          'Support marketing efforts including content creation, social media, and community outreach.',
          'Assist with research tasks such as competitive analysis, customer surveys, and market trends.',
          'Help with administrative tasks and business operations as needed.',
          'Assist in designing promotional materials or visual content where applicable.',
          'Participate in strategy discussions and provide input on business initiatives.',
          'Communicate regularly with Founders and respond promptly to assigned tasks.',
          'Ad hoc tasks as required and/or requested by managers.',
        ],
      },
      {
        heading: 'Required Skills and Abilities',
        items: [
          'Proficient computer skills including Microsoft Office (Excel especially), email, and web.',
          'Strong organizational skills and attention to detail.',
          'Adaptability and problem-solving skills.',
          'A positive, optimistic attitude and demeanor.',
          'Excellent verbal and written communication skills.',
          'Marketing and design experience a plus.',
          'Research and outreach capabilities.',
          'Bilingualism a plus.',
        ],
      },
      {
        heading: 'Schedule',
        body: 'Flexible schedule to suit individual needs. Duration aligned with the summer academic calendar. Primarily remote/flexible with occasional in-person visits to the Klawsome! store in Novi, MI.',
      },
      {
        heading: 'Work Environment',
        body: 'Primarily remote. Occasional visits to the Klawsome! store at Sakura Novi, 42768 Grand River Ave, Suite C-140, Novi, MI 48375. Requires reliable internet access and the ability to communicate via virtual tools.',
      },
      {
        heading: 'Experience & Certifications',
        items: [
          'Currently enrolled in a high school, undergraduate, or graduate program.',
          'Interest in business, journalism, education, or communications preferred.',
          'Marketing and design experience a plus.',
          'Excel experience a plus.',
        ],
      },
    ],
  },

  'Assistant General Manager': {
    meta: [
      { label: 'FLSA Classification', value: 'Non-Exempt' },
      { label: 'Full / Part-Time', value: 'Part-Time' },
      { label: 'Pay Range', value: '$15–$20/hr + performance-based bonus tied to store sales' },
      { label: 'Reports To', value: 'General Manager' },
    ],
    summary:
      'The Assistant Store Manager (AM) is responsible for the successful day-to-day performance of the Klawsome! store under the guidance of the General Manager. This role supports store operations, trains and supervises store associates, delivers exceptional customer service, and achieves store financial targets. The AM assumes all GM responsibilities in the absence of the GM.',
    sections: [
      {
        heading: 'Essential Functions',
        items: [
          'Train store staff on company policies, procedures, and operation standards. Develop associates for future career progression. Train employees on POS systems and claw machine repair (training provided).',
          'Assist GM with recruiting store associates to ensure the store is well staffed.',
          'Uphold high operations standards and oversee day-to-day store performance. In the absence of the GM, perform all GM responsibilities.',
          'Promote a safe and empowering environment for the team. Bring associate relations and work issues to the GM. In the absence of the GM, handle disciplinary actions and performance management.',
          'Build strong relationships with customers, deliver exceptional customer experience, maintain a clean and sanitary store, and handle customer complaints.',
          'Assist GM in executing local marketing initiatives and implementing promotional strategies to attract and retain customers.',
          'Share responsibility with GM for achieving store financial results. Ensure cash handling procedures are followed and labor is within budget.',
          'Assist GM with financial and inventory reports. Perform cash register opening and closing procedures.',
          'Supervise all employees on store operations, customer service standards, and company policies.',
          'Ad hoc tasks as required and/or requested by managers.',
        ],
      },
      {
        heading: 'Required Skills and Abilities',
        items: [
          'Proficient computer skills including Microsoft Office, email, and web.',
          'Strong organizational skills and attention to detail.',
          'Ability to delegate effectively.',
          'Sense of urgency and ability to multitask successfully.',
          'A positive, optimistic attitude and demeanor.',
          'Excellent verbal communication skills.',
          'Outstanding customer service mindset.',
          'Strong people, communication, listening, training, and assessment skills.',
          'Ability to take inventory correctly and perform small repair/maintenance of store equipment.',
          'Ability to embrace change and pursue continuous learning.',
        ],
      },
      {
        heading: 'Schedule',
        body: 'Hours are flexible — minimum 8 hours per week, maximum 29 hours per week. Must be willing to work at least one Friday or Saturday night per week, with the potential to work on holidays. Tentative store hours: Monday closed; Tue/Wed 10:30 AM – 9:30 PM; Thu/Fri 11:00 AM – 9:00 PM; Sat/Sun 11:00 AM – 10:00 PM.',
      },
      {
        heading: 'Work Environment & Physical Demands',
        body: 'Fast-paced, customer-facing retail environment using POS systems, registers, telephones, and printers. Employees regularly carry/lift boxes weighing 60 pounds or more, must stand for extended periods, walk, reach, bend, stoop, kneel, climb steps/ladders, and push/pull merchandise.',
      },
      {
        heading: 'Experience & Certifications',
        items: [
          "High school diploma required; associate's degree or higher preferred.",
          'Prior operations and retail management experience, or a similar leadership role, preferred.',
          'Thorough knowledge of operations policies, procedures, and practices.',
          'Understanding of financial measures and performance metrics.',
        ],
      },
    ],
  },

  'General Manager': {
    meta: [
      { label: 'FLSA Classification', value: 'Exempt (Full-Time, Managerial) / Non-Exempt (Part-Time)' },
      { label: 'Full / Part-Time', value: 'Full-Time or Part-Time' },
      { label: 'Pay Range', value: '$18 – $28/hr' },
      { label: 'Reports To', value: 'Founders / Owners (Agnes & Michal)' },
    ],
    summary:
      'The General Manager (GM) oversees day-to-day operations of the Klawsome! arcade at Sakura Novi (42768 Grand River Ave, Suite C-140, Novi, MI 48375). This role leads a team to deliver superior customer service, ensure operational excellence, manage inventory, drive store sales and profitability, promote brand awareness, and foster a positive, inclusive work environment.',
    sections: [
      {
        heading: 'Essential Functions',
        items: [
          'Manage day-to-day store operations and activities of store associates; plan daily work and allocate assignments based on business needs.',
          'Manage staffing levels by recruiting, training, developing, and retaining quality performers; build a pipeline of internal and external talent.',
          'Foster a positive, inclusive, productive work environment; respond to associate complaints and consult with company resources as needed.',
          'Set clear goals and expectations; provide regular feedback; act as a role model demonstrating Klawsome! values and standards.',
          'Check security cameras to ensure associates arrive promptly; find replacements as needed.',
          'Ensure smooth day-to-day store operations including inventory management, merchandising, and cash handling; maintain a safe, sanitary environment.',
          'Train employees on POS systems and claw machine repair (training provided).',
          'Prepare and submit regular reports on sales, expenses, and inventory; achieve store sales and profit goals; manage overhead, cash, and other assets.',
          'Build strong relationships with customers; handle inquiries, feedback, and complaints promptly via in-person, phone, text, email, and social media.',
          'Implement promotional strategies and promote brand awareness through social media and community outreach.',
          'Ad hoc tasks as required or requested by managers.',
        ],
      },
      {
        heading: 'Required Skills and Abilities',
        items: [
          'Proficient computer skills including Microsoft Office, email, and web.',
          'Strong organizational skills and attention to detail.',
          'Ability to delegate effectively and multitask with a sense of urgency.',
          'A positive, optimistic attitude and outstanding customer service mindset.',
          'Excellent verbal and written communication and interpersonal skills.',
          'Leadership, financial analysis, and time management skills.',
          'Knowledge of labor law and financial measures/performance.',
        ],
      },
      {
        heading: 'Schedule',
        body: 'Hours are flexible — minimum 8 hours per week, maximum 29 hours per week (PT). Must be willing to work at least one Friday or Saturday night per week, with the potential to work on holidays. Tentative store hours: Monday closed; Tue/Wed 10:30 AM – 9:30 PM; Thu/Fri 11:00 AM – 9:00 PM; Sat/Sun 11:00 AM – 10:00 PM.',
      },
      {
        heading: 'Work Environment & Physical Demands',
        body: 'Fast-paced, customer-facing retail environment. Regularly lift/carry boxes of 60 pounds or more, stand for extended periods, walk, reach, bend, stoop, kneel, climb steps/ladders, and push/pull merchandise.',
      },
      {
        heading: 'Experience & Certifications',
        items: [
          "High school diploma required; associate's degree preferred.",
          'Three (3) or more years of operations and retail management experience, or a similar leadership role.',
          'Thorough knowledge of operations policies, procedures, and practices.',
          'Understanding of financial measures and performance.',
        ],
      },
    ],
  },

  'Store Associate': {
    meta: [
      { label: 'Job Title', value: 'Fun Facilitator – Store Associate' },
      { label: 'FLSA Classification', value: 'Non-Exempt' },
      { label: 'Full / Part-Time', value: 'Part-Time' },
      { label: 'Pay Range', value: '$12–$16/hr based on experience' },
      { label: 'Reports To', value: 'General Manager and Assistant Store Manager' },
    ],
    summary:
      'The Store Associate, known as the "Fun Facilitator," creates a lively and welcoming environment for customers. This role focuses on excellent customer service, smooth game operations, restocking plushies, and keeping the facility clean and organized — bringing enthusiasm and a passion for customer interaction so every guest has a memorable experience.',
    sections: [
      {
        heading: 'Essential Functions',
        items: [
          'Greet customers warmly and engage with them to ensure a fun, enjoyable experience.',
          'Assist customers with selecting and enjoying games and activities.',
          'Provide clear instructions with patience and troubleshoot basic game issues courteously.',
          'Maintain cleanliness and organization of the facility at all times.',
          'Operate the point-of-sale (POS) system and handle prize redemptions accurately.',
          'Restock supplies and prizes as needed to ensure machines are fully operational.',
          'Troubleshoot, maintain, and fix claw machines (training provided).',
          'Effectively communicate with managers, notifying them of issues that require specific attention.',
          'Ad hoc tasks as required and/or requested by managers.',
        ],
      },
      {
        heading: 'Required Skills and Abilities',
        items: [
          'Proficient computer skills including Microsoft Office, email, and web applications.',
          'Strong organizational skills and attention to detail.',
          'Sense of urgency and ability to multitask successfully.',
          'A positive and optimistic attitude and demeanor.',
          'Excellent verbal communication skills and outstanding customer service mindset.',
          'Friendly, enthusiastic personality with a love for customer interaction.',
          'Flexible availability, including weekends and holidays.',
        ],
      },
      {
        heading: 'Schedule',
        body: 'Minimum 8 hours per week, maximum 29 hours per week. Must be willing to work at least one Friday or Saturday night per week, with the potential to work on holidays. Tentative store hours: Monday closed; Tue/Wed 10:30 AM – 9:30 PM; Thu/Fri 11:00 AM – 9:00 PM; Sat/Sun 11:00 AM – 10:00 PM.',
      },
      {
        heading: 'Work Environment & Physical Demands',
        body: 'Fast-paced, customer-facing retail environment. Regularly carry/lift boxes of 60 pounds or more, stand for extended periods, walk, reach, bend, stoop, kneel, climb steps/ladders, and push/pull merchandise.',
      },
      {
        heading: 'Experience & Certifications',
        items: [
          'No formal degree required.',
          'Previous customer service experience is a plus.',
        ],
      },
    ],
  },

  'Corporate Development Fellow': {
    meta: [
      { label: 'FLSA Classification', value: 'Non-Exempt (Unpaid Fellowship / Trainee)' },
      { label: 'Full / Part-Time', value: 'Part-time (Fellowship)' },
      { label: 'Pay Range', value: 'Unpaid – Academic Credit Eligible; Letter of Recommendation' },
      { label: 'Reports To', value: 'Founders / Owners (Agnes & Michal)' },
    ],
    summary:
      "The Corporate Development Fellow supports Klawsome!'s expansion strategy as it moves beyond a single location toward franchising and B2B partnerships. The Fellow assists as an architect of this expansion by conducting market research, building financial models, and developing strategic pitch decks — bridging heart-led operations and high-level strategy to package the Klawsome! brand for future franchisees and business partners.",
    sections: [
      {
        heading: 'Essential Functions',
        items: [
          'Deck & Storytelling: Create compelling presentations and pitch decks that convince business owners to partner with Klawsome!',
          'Market Mapping: Conduct market research to identify ideal territories and B2B partners (malls, high-traffic retail). Draft term sheets and Letter of Intent (LOI) frameworks.',
          'Data-Driven Franchise Modeling: Analyze financial data (historical sales, margins, utilization) to build franchise models including unit economics, ROI, and payback period.',
          'Strategic Collaboration: Work directly with Founders on growth strategy sessions, providing data-backed recommendations.',
          'Documentation: Prepare research summaries, competitive analyses, and supporting documents for franchise development.',
          'Ad hoc tasks as required and/or requested by managers.',
        ],
      },
      {
        heading: 'Required Skills and Abilities',
        items: [
          'Proficient computer skills including Microsoft Office (especially Excel and PowerPoint).',
          'Strong organizational skills and attention to detail.',
          'Sense of urgency and ability to multitask successfully.',
          'Excellent verbal and written communication skills.',
          'Self-driven, entrepreneurial mindset; suggests solutions, not just completing tasks.',
          'Ability to build professional, aesthetic, compelling pitch decks.',
          'Strong research and analytical capabilities; adaptability and problem-solving.',
          'Bilingualism a plus.',
        ],
      },
      {
        heading: 'Schedule',
        body: 'Flexible, 4–8 hours per week. Duration: 3–4 months, flexible to align with university semesters. Remote-friendly with occasional in-person strategy syncs at the Klawsome! location in Novi, MI.',
      },
      {
        heading: 'Work Environment',
        body: 'Primarily remote with occasional meetings at the Klawsome! store at Sakura Novi, 42768 Grand River Ave, Suite C-140, Novi, MI 48375. Requires reliable internet access and ability to collaborate via virtual tools.',
      },
      {
        heading: 'Experience & Certifications',
        items: [
          'Currently enrolled in or recently graduated from an undergraduate or graduate program (Business, Finance, Economics, or related field preferred).',
          'Experience building PowerPoint or pitch decks (portfolio sample encouraged).',
          'Excel experience preferred; research and outreach experience a plus.',
        ],
      },
    ],
  },

  'Events Assistant Manager': {
    meta: [
      { label: 'FLSA Classification', value: 'Non-Exempt' },
      { label: 'Full / Part-Time', value: 'Part-Time / Hybrid' },
      { label: 'Reports To', value: 'General Manager / Founders' },
    ],
    summary:
      'The Events Assistant Manager helps plan, coordinate, and execute private parties, birthdays, corporate events, and community activations at Klawsome! This role partners with the GM and Founders to deliver memorable on-site experiences and grow our events business.',
    sections: [
      {
        heading: 'Essential Functions',
        items: [
          'Respond to event inquiries promptly and guide customers through booking, packages, and add-ons.',
          'Coordinate event logistics: scheduling, set-up, staffing, prizes, food/beverage timing, and clean-up.',
          'Be on-site as the point person during events, ensuring guests have a smooth, joyful experience.',
          'Maintain an events calendar and communicate clearly with the floor team and GM.',
          'Help develop and refine party packages, pricing, and add-on offerings.',
          'Support marketing of events through social media content, photos, and follow-ups.',
          'Track event performance (revenue, satisfaction) and suggest improvements.',
        ],
      },
      {
        heading: 'Required Skills and Abilities',
        items: [
          'Excellent communication and customer service skills.',
          'Strong organization and attention to detail; comfortable juggling multiple bookings.',
          'Calm under pressure; problem-solver with a hospitality mindset.',
          'Comfortable with email, scheduling tools, POS, and basic spreadsheets.',
          'Flexible availability including evenings and weekends when most events run.',
        ],
      },
      {
        heading: 'Experience',
        items: [
          'Prior events, hospitality, or customer-facing retail experience preferred.',
          'High school diploma required.',
        ],
      },
    ],
  },

  'Purchasing Specialist': {
    meta: [
      { label: 'FLSA Classification', value: 'Non-Exempt' },
      { label: 'Full / Part-Time', value: 'Part-Time / Hybrid' },
      { label: 'Reports To', value: 'Founders / General Manager' },
    ],
    summary:
      'The Purchasing Specialist sources, orders, and manages the plushie and prize inventory that powers every Klawsome! claw machine. This role keeps our floor stocked with the cutest, most on-trend prizes while staying on budget and on time.',
    sections: [
      {
        heading: 'Essential Functions',
        items: [
          'Source plushies, prizes, and packaging from domestic and overseas suppliers.',
          'Negotiate pricing, MOQs, and lead times with vendors.',
          'Place and track purchase orders; monitor shipments and customs paperwork.',
          'Maintain accurate inventory levels and reorder thresholds in coordination with the store team.',
          'Identify trending characters, licenses, and seasonal items that delight our guests.',
          'Track spend against budget and report on margin per prize category.',
          'Build relationships with new suppliers to diversify and improve our prize mix.',
        ],
      },
      {
        heading: 'Required Skills and Abilities',
        items: [
          'Strong negotiation, organization, and follow-through skills.',
          'Comfort with spreadsheets (Excel/Google Sheets) and basic supplier communication tools.',
          'Attention to detail with numbers, SKUs, and shipping documents.',
          'Curiosity about pop culture, anime, and kawaii trends a big plus.',
          'Bilingual (Mandarin or other) helpful for overseas vendor communication.',
        ],
      },
      {
        heading: 'Experience',
        items: [
          'Prior purchasing, sourcing, supply-chain, or e-commerce buying experience preferred.',
          'High school diploma required; associate or bachelor degree preferred.',
        ],
      },
    ],
  },

  'Arcade Manager (In-Training)': {
    meta: [
      { label: 'Full / Part-Time', value: 'Part-Time (20–29 hours/week)' },
      { label: 'Compensation', value: 'Performance-based bonus opportunity' },
      { label: 'Reports To', value: 'Founders / Owners (Agnes & Michal)' },
    ],
    summary:
      'Klawsome! is a local, Asian-owned business with a mission to share Asian culture and the love of claw machines with young families in the community. The Arcade Manager (In-Training) is a high-visibility role learning to lead a growing arcade — working closely with the founders on daily operations, guest experience, and team support, with growth potential as Klawsome expands.',
    sections: [
      {
        heading: 'Role Snapshot',
        items: [
          'Arcade Manager in Training',
          '20 to 29 hours per week',
          'Performance based bonus opportunity',
          'High visibility role with founders',
          'Growth potential as Klawsome expands',
        ],
      },
      {
        heading: 'Great Fit if You Have…',
        items: [
          'Customer service experience with interest in games, events, and guest experience',
          'Arcade, retail, barista, restaurant, or family entertainment background',
          'Reliable weekend availability',
          'Comfortable leading by example',
        ],
      },
      {
        heading: 'What You Will Do',
        items: [
          'Support daily arcade operations',
          'Help guests with games, prizes, and questions',
          'Keep the space clean, organized, and welcoming',
          'Assist with opening, closing, and shift flow',
          'Help train and support team members',
          'Communicate issues, ideas, and guest feedback',
          'Learn how to help manage a growing arcade business',
        ],
      },
      {
        heading: 'How to Apply',
        body: 'Email your resume to team@klawsomenovi.com or use the Apply Here button to submit an application today!',
      },
    ],
  },

  'Mobile Arcade Specialist': {
    meta: [
      { label: 'Full / Part-Time', value: 'Part-Time (varied hours/week)' },
      { label: 'Compensation', value: 'Performance-based bonus opportunity' },
      { label: 'Reports To', value: 'Founders / Owners (Agnes & Michal)' },
    ],
    summary:
      "Klawsome! is a local, Asian-owned business with a mission to share Asian culture and the love of claw machines with young families in the community. The Mobile Arcade Specialist is a dynamic role focused on Klawsome!'s innovative mobile arcade — driving to events, staffing the trailer, and delivering memorable guest experiences on the road, with growth potential as Klawsome expands.",
    sections: [
      {
        heading: 'Role Snapshot',
        items: [
          "Dynamic role focused on Klawsome!'s innovative mobile arcade",
          'Varied hours per week',
          'Performance based bonus opportunity',
          'Growth potential as Klawsome expands',
        ],
      },
      {
        heading: 'Great Fit if You Have…',
        items: [
          "Driver's license, clean driving record, and willingness to drive a 16 ft trailer attached to a truck",
          'Customer service experience with interest in games, events, and guest experience',
          'Arcade, retail, barista, restaurant, or family entertainment background',
          'Reliable weekend availability',
        ],
      },
      {
        heading: 'What You Will Do',
        items: [
          'Driving to and staffing events',
          'Helping guests with games, prizes, and questions',
          'Keeping the space clean, organized, and welcoming',
          'Preparing and stocking the trailer with plushies according to event requests',
          'Communicating issues, ideas, and guest feedback throughout events',
        ],
      },
      {
        heading: 'How to Apply',
        body: 'Email your resume to team@klawsomenovi.com or use the Apply Here button to submit an application today!',
      },
    ],
  },
};