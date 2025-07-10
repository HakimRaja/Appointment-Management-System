table : address {
    id: uuid PK;
    user_id : uuid;
    province : String;
    city : String;
    street:  String;
    house :  String;
    postalCode :String;
}

table : user {
    user_id : uuid PK;
    name : String;
    email : String;
    password : hash(String);
    role : enum {doctor,admin,patient};
    age : number;
}

table : doctor {
    user_id : FK from users table PK;
    specialization : String;
    experience : we will take the starting date and calculate;
}

table : permissions {
    permission_id: uuid;
    permission: String;
    role: enum;
}

table : patient {
    user_id : FK from users table PK;
    patient_history : String;
}

table : availability {
    a_id : uuid PK;
    user_id : uuid from users table FK;
    mon time slots in 00 00 - 23 59,
     tue time slots in 00 00 - 23 59,
     wed time slots in 00 00 - 23 59,
     thurstime slots in 00 00 - 23 59,
     fri time slots in 00 00 - 23 59,
     sat time slots in 00 00 - 23 59,
    sun : time slots in 00 00 - 23 59
}

table : appointments {
    appointment_id : uuid PK;
    user_id1(patient_id) : FK;
    user_id2(doctore_id) : FK;
    description : String;
    status : enum {cancelled , scheduled , completed};
}

table : check_up_details {
    appointment_id : FK form appointments;PK
    observation : String;
    follow_ups : String;
}

table : payments {
    <!-- payment_id :uuid PK; -->
    appointment_id : FK form appointments;PK
    status : {completed ,pending};
}
table : review_by_patients {
    <!-- review_id : uuid PK; -->
    appointment_id : FK form appointments; 1-1 rel
    review : String
}
