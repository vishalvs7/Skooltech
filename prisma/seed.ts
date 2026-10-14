import { PrismaClient, UserRole, StudentStatus, AttendanceStatus, FeeBillingCycle, PaymentMethod } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Skooltech Sandbox Database Seeder...");

  // 1. Clean existing demo data if any
  const existingSchool = await prisma.school.findUnique({
    where: { code: "DEMO01" },
  });

  if (existingSchool) {
    console.log("🧹 Clearing previous DEMO01 sandbox data...");
    await prisma.school.delete({ where: { id: existingSchool.id } });
  }

  // 2. Hash default passwords
  const staffPasswordHash = await bcrypt.hash("DemoPass@123", 10);
  const studentPasswordHash = await bcrypt.hash("Student@123", 10);

  // 3. Create Demo School Tenant
  console.log("🏫 Creating Greenwood International School (DEMO01)...");
  const school = await prisma.school.create({
    data: {
      code: "DEMO01",
      slug: "greenwood-demo",
      name: "Greenwood International School",
      affiliationNo: "CBSE-AFF-2026/8834",
      address: "Plot 14, Institutional Area, Sector 62, Noida, Uttar Pradesh 201309",
      phone: "+91 98765 43210",
      email: "principal@greenwoodschool.edu.in",
      currency: "INR",
      gradingScale: "PERCENTAGE",
      status: "ACTIVE",
      plan: "PRO",
      paymentGateway: "MOCK",
      paymentKeyId: "rzp_test_greenwood_demo",
      paymentSecret: "mock_secret_enc_greenwood",
    },
  });

  // 4. Create Active Academic Session (2026-2027)
  console.log("📅 Creating Academic Session 2026-2027...");
  const session = await prisma.academicSession.create({
    data: {
      schoolId: school.id,
      name: "2026-2027",
      startDate: new Date("2026-04-01"),
      endDate: new Date("2027-03-31"),
      isCurrent: true,
    },
  });

  // 5. Create Staff Accounts
  console.log("👥 Creating Staff Users (Admin, Principal, Accounts, Teachers)...");
  
  // School Admin
  await prisma.user.create({
    data: {
      schoolId: school.id,
      username: "admin_demo",
      passwordHash: staffPasswordHash,
      role: UserRole.SCHOOL_ADMIN,
      email: "admin@greenwoodschool.edu.in",
      phone: "+91 98111 22201",
      mustChangePassword: false,
    },
  });

  // Principal
  await prisma.user.create({
    data: {
      schoolId: school.id,
      username: "principal_demo",
      passwordHash: staffPasswordHash,
      role: UserRole.PRINCIPAL,
      email: "principal@greenwoodschool.edu.in",
      phone: "+91 98111 22202",
      mustChangePassword: false,
    },
  });

  // Accountant
  const accountantUser = await prisma.user.create({
    data: {
      schoolId: school.id,
      username: "accounts_demo",
      passwordHash: staffPasswordHash,
      role: UserRole.ACCOUNTS,
      email: "accounts@greenwoodschool.edu.in",
      phone: "+91 98111 22203",
      mustChangePassword: false,
    },
  });

  // Teachers
  const teacherUser1 = await prisma.user.create({
    data: {
      schoolId: school.id,
      username: "teacher_sharma",
      passwordHash: staffPasswordHash,
      role: UserRole.TEACHER,
      email: "rsharma@greenwoodschool.edu.in",
      phone: "+91 98111 22204",
      mustChangePassword: false,
    },
  });

  const teacherProfile1 = await prisma.teacher.create({
    data: {
      userId: teacherUser1.id,
      fullName: "Mr. Rajesh Sharma",
      employeeId: "TCH-001",
      designation: "Senior PGT Mathematics",
    },
  });

  const teacherUser2 = await prisma.user.create({
    data: {
      schoolId: school.id,
      username: "teacher_verma",
      passwordHash: staffPasswordHash,
      role: UserRole.TEACHER,
      email: "sverma@greenwoodschool.edu.in",
      phone: "+91 98111 22205",
      mustChangePassword: false,
    },
  });

  const teacherProfile2 = await prisma.teacher.create({
    data: {
      userId: teacherUser2.id,
      fullName: "Mrs. Sunita Verma",
      employeeId: "TCH-002",
      designation: "TGT Science & Biology",
    },
  });

  // 6. Create Classes & Sections
  console.log("📚 Creating Classes & Sections...");
  const class5 = await prisma.class.create({
    data: {
      schoolId: school.id,
      name: "Class 5",
      numericOrder: 5,
    },
  });

  const section5A = await prisma.section.create({
    data: {
      classId: class5.id,
      name: "A",
      classTeacherId: teacherProfile1.id, // Rajesh Sharma is Class Teacher of 5-A
    },
  });

  const section5B = await prisma.section.create({
    data: {
      classId: class5.id,
      name: "B",
      classTeacherId: teacherProfile2.id, // Sunita Verma is Class Teacher of 5-B
    },
  });

  const class6 = await prisma.class.create({
    data: {
      schoolId: school.id,
      name: "Class 6",
      numericOrder: 6,
    },
  });

  const section6A = await prisma.section.create({
    data: {
      classId: class6.id,
      name: "A",
    },
  });

  // 7. Create Fee Structures
  console.log("💰 Creating Fee Structures (Monthly & Quarterly)...");
  const primaryFeeStructure = await prisma.feeStructure.create({
    data: {
      schoolId: school.id,
      name: "Primary Standard Fee (Class 1-5)",
      cycle: FeeBillingCycle.QUARTERLY,
      amount: 13500.00, // ₹4,500/month = ₹13,500/quarter
      lateFeePerDay: 25.00,
      lateFeeCap: 1000.00,
      graceDays: 5,
    },
  });

  // 8. Seed 40 Students & Enrollments
  console.log("🎓 Seeding 40 Students across sections...");
  const indianNames = [
    { first: "Aarav", last: "Sharma", gender: "Male" },
    { first: "Ananya", last: "Iyer", gender: "Female" },
    { first: "Vihaan", last: "Patel", gender: "Male" },
    { first: "Ishaan", last: "Gupta", gender: "Male" },
    { first: "Saanvi", last: "Reddy", gender: "Female" },
    { first: "Diya", last: "Mehta", gender: "Female" },
    { first: "Aditya", last: "Choudhury", gender: "Male" },
    { first: "Riya", last: "Kapoor", gender: "Female" },
    { first: "Arjun", last: "Nair", gender: "Male" },
    { first: "Myra", last: "Bose", gender: "Female" },
    { first: "Kabir", last: "Malhotra", gender: "Male" },
    { first: "Avani", last: "Joshi", gender: "Female" },
    { first: "Reyansh", last: "Singhania", gender: "Male" },
    { first: "Anika", last: "Deshmukh", gender: "Female" },
    { first: "Dhruv", last: "Rao", gender: "Male" },
    { first: "Kiara", last: "Chatterjee", gender: "Female" },
    { first: "Vivaan", last: "Saxena", gender: "Male" },
    { first: "Ira", last: "Bhardwaj", gender: "Female" },
    { first: "Atharv", last: "Kulkarni", gender: "Male" },
    { first: "Prisha", last: "Aggarwal", gender: "Female" },
    { first: "Advait", last: "Trivedi", gender: "Male" },
    { first: "Navya", last: "Sengupta", gender: "Female" },
    { first: "Samar", last: "Chauhan", gender: "Male" },
    { first: "Tara", last: "Menon", gender: "Female" },
    { first: "Shaurya", last: "Verma", gender: "Male" }, // End of 25 for Class 5-A
    { first: "Tanvi", last: "Shukla", gender: "Female" },
    { first: "Rohan", last: "Mishra", gender: "Male" },
    { first: "Meera", last: "Garg", gender: "Female" },
    { first: "Kunal", last: "Bhatia", gender: "Male" },
    { first: "Pooja", last: "Pandey", gender: "Female" },
    { first: "Varun", last: "Grover", gender: "Male" },
    { first: "Nisha", last: "Yadav", gender: "Female" },
    { first: "Harsh", last: "Tiwari", gender: "Male" },
    { first: "Sneha", last: "Rastogi", gender: "Female" },
    { first: "Manish", last: "Tripathi", gender: "Male" },
    { first: "Kavya", last: "Dubey", gender: "Female" },
    { first: "Akash", last: "Chopra", gender: "Male" },
    { first: "Simran", last: "Bajaj", gender: "Female" },
    { first: "Gaurav", last: "Bansal", gender: "Male" },
    { first: "Deepika", last: "Thakur", gender: "Female" },
  ];

  const class5AEnrollments = [];

  for (let i = 0; i < indianNames.length; i++) {
    const person = indianNames[i];
    const admissionNo = `ADM-${1001 + i}`;
    const fullName = `${person.first} ${person.last}`;
    const targetSection = i < 25 ? section5A : (i < 33 ? section5B : section6A);
    const rollNo = i < 25 ? `${i + 1}` : `${(i % 15) + 1}`;

    const studentUser = await prisma.user.create({
      data: {
        schoolId: school.id,
        username: admissionNo,
        passwordHash: studentPasswordHash,
        role: UserRole.STUDENT,
        email: `${person.first.toLowerCase()}.${admissionNo.toLowerCase()}@greenwoodschool.edu.in`,
        phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
        mustChangePassword: false,
      },
    });

    const student = await prisma.student.create({
      data: {
        userId: studentUser.id,
        schoolId: school.id,
        admissionNo: admissionNo,
        fullName: fullName,
        dob: new Date("2015-06-15"),
        gender: person.gender,
        parentName: `Mr. & Mrs. ${person.last}`,
        parentPhone: studentUser.phone,
        parentEmail: `parent.${person.first.toLowerCase()}@gmail.com`,
        status: StudentStatus.ACTIVE,
      },
    });

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: student.id,
        sessionId: session.id,
        sectionId: targetSection.id,
        rollNo: rollNo,
      },
    });

    if (i < 25) {
      class5AEnrollments.push({ enrollment, student });
    }

    // Create Term 1 Fee Invoice
    const isPaid = i % 3 !== 0; // 2/3 paid, 1/3 pending/overdue
    const invoice = await prisma.feeInvoice.create({
      data: {
        schoolId: school.id,
        studentId: student.id,
        title: "Quarter 1 (April-June 2026) Fee",
        baseAmount: 13500.00,
        dueDate: new Date("2026-04-10"),
        paidAmount: isPaid ? 13500.00 : 0.00,
        isPaid: isPaid,
      },
    });

    if (isPaid) {
      await prisma.paymentTransaction.create({
        data: {
          schoolId: school.id,
          invoiceId: invoice.id,
          receiptNo: `RCP-2026-${String(i + 1).padStart(4, "0")}`,
          amountPaid: 13500.00,
          lateFeeCharged: 0.00,
          paymentMethod: i % 2 === 0 ? PaymentMethod.UPI : PaymentMethod.CASH,
          referenceNo: i % 2 === 0 ? `UPI-UTR-987456${i}12` : null,
          collectedById: accountantUser.id,
          notes: "Collected at school cash desk",
        },
      });
    }
  }

  // 9. Seed 10 Days of Attendance for Class 5-A
  console.log("📝 Seeding past attendance logs for Class 5-A...");
  const sampleDates = [
    "2026-04-02", "2026-04-03", "2026-04-06", "2026-04-07", "2026-04-08",
    "2026-04-09", "2026-04-10", "2026-04-13", "2026-04-14", "2026-04-15"
  ];

  for (const dateStr of sampleDates) {
    const attendanceDate = new Date(dateStr);
    for (let s = 0; s < class5AEnrollments.length; s++) {
      const { enrollment } = class5AEnrollments[s];
      // Randomly make 1-2 students absent occasionally
      const isAbsent = (s === 3 && dateStr === "2026-04-08") || (s === 7 && dateStr === "2026-04-14");
      const isLate = (s === 12 && dateStr === "2026-04-09");

      await prisma.attendance.create({
        data: {
          schoolId: school.id,
          enrollmentId: enrollment.id,
          date: attendanceDate,
          status: isAbsent ? AttendanceStatus.ABSENT : (isLate ? AttendanceStatus.LATE : AttendanceStatus.PRESENT),
          remarks: isAbsent ? "Fever reported by parent" : (isLate ? "Bus delayed" : null),
          markedById: teacherUser1.id,
        },
      });
    }
  }

  // 10. Seed Exam & Results (PT-1)
  console.log("📊 Seeding Periodic Test 1 (PT-1) Exam & Results...");
  const pt1Exam = await prisma.exam.create({
    data: {
      schoolId: school.id,
      name: "Periodic Test 1 (PT-1)",
      examType: "UNIT_TEST",
      startDate: new Date("2026-05-15"),
      createdById: teacherUser1.id,
    },
  });

  const subjects = [
    { name: "Mathematics", max: 40 },
    { name: "Science", max: 40 },
    { name: "English", max: 40 },
    { name: "Hindi", max: 40 },
    { name: "Social Science", max: 40 },
  ];

  for (const { enrollment } of class5AEnrollments.slice(0, 10)) {
    for (const sub of subjects) {
      const randomScore = Math.floor(28 + Math.random() * 12); // Scores between 28 and 39 out of 40
      await prisma.examResult.create({
        data: {
          schoolId: school.id,
          examId: pt1Exam.id,
          enrollmentId: enrollment.id,
          subject: sub.name,
          totalMarks: sub.max,
          obtainedMarks: randomScore,
          remarks: randomScore > 35 ? "Excellent" : "Good performance",
        },
      });
    }
  }

  // 11. Seed Notices
  console.log("📢 Seeding School Announcements...");
  await prisma.notice.create({
    data: {
      schoolId: school.id,
      title: "Welcome to Academic Session 2026-2027",
      content: "All classes have commenced as per regular timetable. School gates close promptly at 08:00 AM.",
      targetRole: "ALL",
      createdById: teacherUser1.id,
    },
  });

  await prisma.notice.create({
    data: {
      schoolId: school.id,
      title: "Periodic Test 1 (PT-1) Schedule Announced",
      content: "PT-1 assessments will commence from May 15, 2026. Please check syllabus distributed by subject teachers.",
      targetRole: "STUDENT",
      createdById: teacherUser1.id,
    },
  });

  console.log("✅ Seeding completed successfully!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔑 DEMO SANDBOX CREDENTIALS (School Code: DEMO01):");
  console.log("   • School Admin : admin_demo     / DemoPass@123");
  console.log("   • Principal    : principal_demo / DemoPass@123");
  console.log("   • Accounts     : accounts_demo  / DemoPass@123");
  console.log("   • Class Teacher: teacher_sharma / DemoPass@123 (Class 5-A)");
  console.log("   • Student      : ADM-1001       / Student@123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
