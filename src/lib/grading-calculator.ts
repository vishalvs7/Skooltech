/**
 * CBSE & Modular Indian Grading & Evaluation Engine
 * Supports CBSE 9-point grading scale, Percentage, CGPA on 10.0, and CGPA on 5.0
 */

export interface SubjectGrade {
  percentage: number;
  grade: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "D" | "E";
  gradePoint10: number;
  gradePoint5: number;
  remark: string;
  isPassing: boolean;
}

export interface SubjectResultInput {
  subject: string;
  totalMarks: number;
  obtainedMarks: number;
  remarks?: string | null;
}

export interface EvaluatedSubjectResult extends SubjectGrade {
  subject: string;
  totalMarks: number;
  obtainedMarks: number;
  customRemarks?: string | null;
}

export interface ReportCardEvaluation {
  subjects: EvaluatedSubjectResult[];
  grandTotalMarks: number;
  grandObtainedMarks: number;
  overallPercentage: number;
  overallGrade: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "D" | "E";
  cgpa10: number;
  cgpa5: number;
  displayScore: string;
  status: "PASSED" | "PROMOTED" | "NEEDS_IMPROVEMENT";
  overallRemark: string;
}

/**
 * Calculates CBSE 9-point grade and grade points for a single subject score
 */
export function calculateSubjectGrade(obtained: number, total: number): SubjectGrade {
  if (total <= 0) {
    return {
      percentage: 0,
      grade: "E",
      gradePoint10: 0,
      gradePoint5: 0,
      remark: "Invalid total marks",
      isPassing: false,
    };
  }

  const rawPercentage = (obtained / total) * 100;
  // Round to 2 decimal places
  const percentage = Math.round(rawPercentage * 100) / 100;

  if (percentage >= 91) {
    return {
      percentage,
      grade: "A1",
      gradePoint10: 10.0,
      gradePoint5: 5.0,
      remark: "Outstanding",
      isPassing: true,
    };
  } else if (percentage >= 81) {
    return {
      percentage,
      grade: "A2",
      gradePoint10: 9.0,
      gradePoint5: 4.5,
      remark: "Excellent",
      isPassing: true,
    };
  } else if (percentage >= 71) {
    return {
      percentage,
      grade: "B1",
      gradePoint10: 8.0,
      gradePoint5: 4.0,
      remark: "Very Good",
      isPassing: true,
    };
  } else if (percentage >= 61) {
    return {
      percentage,
      grade: "B2",
      gradePoint10: 7.0,
      gradePoint5: 3.5,
      remark: "Good",
      isPassing: true,
    };
  } else if (percentage >= 51) {
    return {
      percentage,
      grade: "C1",
      gradePoint10: 6.0,
      gradePoint5: 3.0,
      remark: "Satisfactory",
      isPassing: true,
    };
  } else if (percentage >= 41) {
    return {
      percentage,
      grade: "C2",
      gradePoint10: 5.0,
      gradePoint5: 2.5,
      remark: "Average",
      isPassing: true,
    };
  } else if (percentage >= 33) {
    return {
      percentage,
      grade: "D",
      gradePoint10: 4.0,
      gradePoint5: 2.0,
      remark: "Marginal / Passed",
      isPassing: true,
    };
  } else {
    return {
      percentage,
      grade: "E",
      gradePoint10: 0.0,
      gradePoint5: 0.0,
      remark: "Needs Improvement",
      isPassing: false,
    };
  }
}

/**
 * Evaluates an entire collection of subject results for a student report card
 * Supports School-configured grading scale: "PERCENTAGE", "CGPA_10", or "CGPA_5"
 */
export function evaluateReportCard(
  results: SubjectResultInput[],
  gradingScale: "PERCENTAGE" | "CGPA_10" | "CGPA_5" = "PERCENTAGE"
): ReportCardEvaluation {
  if (!results || results.length === 0) {
    return {
      subjects: [],
      grandTotalMarks: 0,
      grandObtainedMarks: 0,
      overallPercentage: 0,
      overallGrade: "E",
      cgpa10: 0,
      cgpa5: 0,
      displayScore: "0%",
      status: "NEEDS_IMPROVEMENT",
      overallRemark: "No assessment records available.",
    };
  }

  let grandTotal = 0;
  let grandObtained = 0;
  let totalGradePoint10 = 0;
  let totalGradePoint5 = 0;
  let hasFailedSubject = false;

  const evaluatedSubjects: EvaluatedSubjectResult[] = results.map((res) => {
    const total = Number(res.totalMarks) || 0;
    const obtained = Number(res.obtainedMarks) || 0;
    const gradeInfo = calculateSubjectGrade(obtained, total);

    grandTotal += total;
    grandObtained += obtained;
    totalGradePoint10 += gradeInfo.gradePoint10;
    totalGradePoint5 += gradeInfo.gradePoint5;

    if (!gradeInfo.isPassing) {
      hasFailedSubject = true;
    }

    return {
      ...gradeInfo,
      subject: res.subject,
      totalMarks: total,
      obtainedMarks: obtained,
      customRemarks: res.remarks,
    };
  });

  const rawOverallPercentage = grandTotal > 0 ? (grandObtained / grandTotal) * 100 : 0;
  const overallPercentage = Math.round(rawOverallPercentage * 100) / 100;
  const overallGradeInfo = calculateSubjectGrade(grandObtained, grandTotal);

  const count = results.length;
  const cgpa10 = Math.round((totalGradePoint10 / count) * 100) / 100;
  const cgpa5 = Math.round((totalGradePoint5 / count) * 100) / 100;

  // Determine display label based on school configuration
  let displayScore = `${overallPercentage}%`;
  if (gradingScale === "CGPA_10") {
    displayScore = `${cgpa10.toFixed(1)} / 10.0 CGPA`;
  } else if (gradingScale === "CGPA_5") {
    displayScore = `${cgpa5.toFixed(1)} / 5.0 GPA`;
  }

  let status: "PASSED" | "PROMOTED" | "NEEDS_IMPROVEMENT" = "PASSED";
  let overallRemark = "Consistently good academic performance.";

  if (hasFailedSubject || overallPercentage < 33) {
    status = "NEEDS_IMPROVEMENT";
    overallRemark = "Remedial coaching recommended in subject(s) scoring below passing threshold.";
  } else if (overallPercentage >= 85) {
    status = "PROMOTED";
    overallRemark = "Outstanding academic achievement. Exemplary grasp of subject curriculum.";
  } else if (overallPercentage >= 70) {
    status = "PASSED";
    overallRemark = "Commendable performance. Encouraged to aim for higher distinction.";
  }

  return {
    subjects: evaluatedSubjects,
    grandTotalMarks: grandTotal,
    grandObtainedMarks: grandObtained,
    overallPercentage,
    overallGrade: overallGradeInfo.grade,
    cgpa10,
    cgpa5,
    displayScore,
    status,
    overallRemark,
  };
}
