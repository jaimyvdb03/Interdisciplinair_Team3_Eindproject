import os
import random
import json
from datetime import datetime, timedelta
from itertools import count

import pandas as pd
from faker import Faker

fake = Faker()
random.seed(42)
Faker.seed(42)

# Configuration
num_users = 200
sessions_per_user = (1, 8)
lessons_per_session = (1, 10)
exercises_per_session = (0, 8)

num_courses = 10
parts_per_lesson = (2, 6)
questions_per_exercise = 1
answers_per_question = 4
help_types = ["hint", "explain", "example"]
part_types = ["text", "exercise", "audio"]
part_type_distribution = [5, 3, 2]
action_types = ["start", "pause", "resume", "stop"]
action_distribution = [1, 2, 2, 1]

output_folder = r"C:\Users\marit\OneDrive - Hogeschool Rotterdam\Interdisiplinair team3\generated_data\data"

def random_bool(probability=0.5):
    return random.random() < probability

def random_timestamp(start_time, end_time):
    start = datetime.fromisoformat(start_time)
    end = datetime.fromisoformat(end_time)
    span_seconds = (end - start).total_seconds()
    offset = random.uniform(0, max(span_seconds, 1))
    return (start + timedelta(seconds=offset)).isoformat(timespec='seconds')


# Table generation

print("Generating users...")
id_counter = count(1)
all_users = []
user_creation_times = {}
for _ in range(num_users):
    join_date = fake.date_time_between(start_date="-2y", end_date="-30d")
    enrolled_in = random.sample(range(1, num_courses + 1), k=random.randint(1, 4))
    knowledge_levels = {str(c): random.randint(1, 5) for c in enrolled_in}
    user_id = next(id_counter)
    user_creation_times[user_id] = join_date
    all_users.append({
        "user_id": user_id,
        "age": random.randint(18, 65),
        "education": random.choice(["Basisschool", "Middelbaar", "MBO", "HBO", "WO"]),
        "knowledge_per_course": json.dumps(knowledge_levels),
        "joined_at": join_date.isoformat(timespec='seconds'),
        "app_time_seconds": random.randint(300, 500_000),
    })
users = pd.DataFrame(all_users)
user_ids = users["user_id"].tolist()


print("Generating sessions...")
id_counter = count(1)
all_sessions = []
for user_id in user_ids:
    num_sessions = random.randint(*sessions_per_user)
    earliest_date = user_creation_times[user_id]
    for _ in range(num_sessions):
        start = fake.date_time_between(start_date=earliest_date, end_date="now")
        length = timedelta(minutes=random.randint(5, 120))
        end = start + length
        all_sessions.append({
            "session_id": next(id_counter),
            "user_id": user_id,
            "started": start.isoformat(timespec='seconds'),
            "ended": end.isoformat(timespec='seconds'),
            "duration_seconds": int(length.total_seconds()),
        })
sessions = pd.DataFrame(all_sessions)
session_ids = sessions["session_id"].tolist()
session_timeframes = dict(zip(sessions["session_id"],
                              zip(sessions["started"], sessions["ended"])))


print("Generating lessons...")
id_counter = count(1)
all_lessons = []
for course_id in range(1, num_courses + 1):
    for order in range(1, random.randint(4, 8)):
        all_lessons.append({
            "lesson_id": next(id_counter),
            "course_id": course_id,
            "title": fake.sentence(nb_words=4).rstrip('.'),
            "sequence_order": order,
            "created_at": fake.date_time_between(start_date="-2y", end_date="-60d").isoformat(timespec='seconds'),
        })
lessons = pd.DataFrame(all_lessons)
lesson_ids = lessons["lesson_id"].tolist()


print("Generating lesson components...")
id_counter = count(1)
all_parts = []
for lesson_id in lesson_ids:
    num_parts = random.randint(*parts_per_lesson)
    for order in range(1, num_parts + 1):
        part_type = random.choices(part_types, weights=part_type_distribution)[0]
        all_parts.append({
            "part_id": next(id_counter),
            "lesson_id": lesson_id,
            "type": part_type,
            "sequence_order": order,
            "content": fake.paragraph(nb_sentences=3) if part_type in ("text", "exercise") else None,
            "audio_url": f"https://cdn.example.com/audio/{fake.uuid4()}.mp3" if part_type in ("audio", "exercise") else None,
        })
parts = pd.DataFrame(all_parts)
exercise_parts = parts[parts["type"] == "exercise"]["part_id"].tolist()
all_part_ids = parts["part_id"].tolist()


print("Generating lesson events...")
id_counter = count(1)
all_interactions = []
for session_id in session_ids:
    num_interactions = random.randint(*lessons_per_session)
    start_time, end_time = session_timeframes[session_id]
    for _ in range(num_interactions):
        had_audio = random_bool(0.3)
        all_interactions.append({
            "interaction_id": next(id_counter),
            "session_id": session_id,
            "lesson_id": random.choice(lesson_ids),
            "part_id": random.choice(all_part_ids),
            "action": random.choices(action_types, weights=action_distribution)[0],
            "time_spent_seconds": random.randint(10, 900),
            "audio_replays": random.randint(1, 5) if had_audio else 0,
            "audio_interrupts": random.randint(0, 5) if had_audio else 0,
            "timestamp": random_timestamp(start_time, end_time),
        })
lesson_interactions = pd.DataFrame(all_interactions)


print("Generating exercise questions...")
id_counter = count(1)
all_questions = []
for part_id in exercise_parts:
    all_questions.append({
        "ex_question_id": next(id_counter),
        "part_id": part_id,
        "text": fake.sentence(nb_words=random.randint(8, 16)).rstrip('.') + '?',
        "difficulty": random.randint(1, 5),
        "audio_url": f"https://cdn.example.com/audio/{fake.uuid4()}.mp3" if part_type in ("audio", "exercise") else None
    })
questions = pd.DataFrame(all_questions)
ex_question_ids = questions["ex_question_id"].tolist()


print("Generating exercise question...")
id_counter = count(1)
all_answers = []
correct_per_question = {}

for q_id in ex_question_ids:
    correct_position = random.randint(0, answers_per_question - 1)
    question_answers = []
    for position in range(answers_per_question):
        answer_id = next(id_counter)
        is_correct = (position == correct_position)
        all_answers.append({
            "ex_answer_id": answer_id,
            "ex_question_id": q_id,
            "text": fake.sentence(nb_words=random.randint(4, 10)).rstrip('.'),
            "is_correct": is_correct,
            "order": position + 1,
            "audio_url": f"https://cdn.example.com/audio/{fake.uuid4()}.mp3" if part_type in ("audio", "exercise") else None
        })
        question_answers.append((answer_id, is_correct))
    correct_per_question[q_id] = question_answers

answers = pd.DataFrame(all_answers)


print("Generating exercise events...")
id_counter = count(1)
all_attempts = []

for session_id in session_ids:
    num_attempts = random.randint(*exercises_per_session)
    start_time, end_time = session_timeframes[session_id]
    for _ in range(num_attempts):
        needs_help = random_bool(0.2)
        q_id = random.choice(ex_question_ids)

        # Select answer with bias toward correct (65% chance)
        q_answers = correct_per_question[q_id]
        correct_options = [a for a in q_answers if a[1]]
        incorrect_options = [a for a in q_answers if not a[1]]
        
        if random_bool(0.65) and correct_options:
            selected_id, _ = random.choice(correct_options)
            correct = True
        else:
            selected_id, _ = random.choice(incorrect_options)
            correct = False

        had_audio = random_bool(0.25)
        all_attempts.append({
            "attempt_id": next(id_counter),
            "session_id": session_id,
            "question_id": q_id,
            "answer_chosen": selected_id,
            "correct": correct,
            "time_spent_seconds": random.randint(5, 300),
            "timestamp": random_timestamp(start_time, end_time),
            "asked_for_help": needs_help,
            "help_type": random.choice(help_types) if needs_help else None,
            "audio_replays": random.randint(1, 4) if had_audio else 0,
            "audio_interrupts": random.randint(0, 3) if had_audio else 0,
            "selected_awnser":random.choice(["A","B","C","D"]),
        })
exercise_events = pd.DataFrame(all_attempts)


print("Generating chatbothelp")
id_counter = count(1)
all_help = []
for _, row in exercise_events[exercise_events["asked_for_help"]].iterrows():
    help_time = datetime.fromisoformat(row["timestamp"]) + timedelta(seconds=random.randint(2, 30))
    all_help.append({
        "help_id": next(id_counter),
        "attempt_id": row["attempt_id"],
        "question_asked": fake.sentence(nb_words=random.randint(6, 14)),
        "timestamp": help_time.isoformat(timespec='seconds'),
        "type": row["help_type"],
    })
help_records = pd.DataFrame(all_help)


print("\nSaving data...")
os.makedirs(output_folder, exist_ok=True)

users.to_csv(f"{output_folder}/users.csv", index=False)
sessions.to_csv(f"{output_folder}/sessions.csv", index=False)
lessons.to_csv(f"{output_folder}/lessons.csv", index=False)
parts.to_csv(f"{output_folder}/lesson_parts.csv", index=False)
questions.to_csv(f"{output_folder}/exercise_questions.csv", index=False)
answers.to_csv(f"{output_folder}/answer_options.csv", index=False)
lesson_interactions.to_csv(f"{output_folder}/lesson_interactions.csv", index=False)
exercise_events.to_csv(f"{output_folder}/exercise_events.csv", index=False)
help_records.to_csv(f"{output_folder}/chatbothelp.csv", index=False)

print("\n✓ Complete!")
print(f"\nGenerated files:")
print(f"  users..................{len(users):>6,}")
print(f"  sessions..............{len(sessions):>6,}")
print(f"  lessons...............{len(lessons):>6,}")
print(f"  lesson parts..........{len(parts):>6,}")
print(f"  exercise questions....{len(questions):>6,}")
print(f"  answer options........{len(answers):>6,}")
print(f"  lesson interactions...{len(lesson_interactions):>6,}")
print(f"  exercise events.......{len(exercise_events):>6,}")
print(f"  chatbot help.........{len(help_records):>6,}")