class TrainerSubmission {
  constructor(
    contactName,
    email,
    phoneNumber,
    gymName,
    trainerCertification,
    proofDocument,
    address,
    description,
    website,
    submissionDate,
    status
  ) {
    this.contactName = contactName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.gymName = gymName;
    this.trainerCertification = trainerCertification;
    this.proofDocument = proofDocument;
    this.address = address;
    this.description = description;
    this.website = website;
    this.submissionDate = submissionDate;
    this.status = status;
  }

  toString() {
    return `${this.contactName}, ${this.gymName}, ${this.status}`;
  }
}

const trainerSubmissionConverter = {
  toFirestore: (submission) => ({
    contact_name: submission.contactName,
    email: submission.email,
    phone_number: submission.phoneNumber,
    gym_name: submission.gymName,
    trainer_certification: submission.trainerCertification,
    proof_document: submission.proofDocument,
    address: submission.address,
    description: submission.description,
    website: submission.website,
    submission_date: submission.submissionDate,
    status: submission.status
  }),

  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new TrainerSubmission(
      data.contact_name,
      data.email,
      data.phone_number,
      data.gym_name,
      data.trainer_certification,
      data.proof_document,
      data.address,
      data.description,
      data.website,
      data.submission_date,
      data.status
    );
  }
};

export { TrainerSubmission, trainerSubmissionConverter };
