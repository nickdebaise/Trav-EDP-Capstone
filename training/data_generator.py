from faker import Faker
import random as rand
import csv

bob = Faker ()

Faker.seed(42)

jobs = {
    'Software Engineer': (70000, 120000),  # (probability, min_salary, max_salary)
    'Data Scientist': (80000, 130000),
    'Project Manager': (60000, 110000),
    'UX Designer': (55000, 95000),
    'EDP': (75000, 90000),
}

locations = {'New York', 'Hartford', "Saint Paul"}

    


def generate_employee_data(num_records):
    """Generates a specified number of dummy employee records."""
    employees = []
    for _ in range(num_records):
        name = bob.name()
        phone_number = bob.phone_number()
        job_titles = list(jobs.keys())
        job_title = rand.choice(job_titles)

        work_locations = list(locations)
        work_location = rand.choice(work_locations)  

        salary_range = jobs[job_title]  
        random_salary = rand.randint(salary_range[0], salary_range[1])

        employees.append({
            'name': name,
            'job_title': job_title,
            'work_location': work_location,
            'phone_number': phone_number,
            'salary': random_salary
        })
    return employees

def save_to_csv(data, filename="employee_data.csv"):
    with open(filename, 'w', newline='') as csvfile:
        fieldnames = ['name', 'job_title', 'work_location', 'phone_number', 'salary']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        writer.writerows(data)
    print(f"Successfully saved {len(data)} records to {filename}")


def main():
    num_records = 1000  # Minimum number of records required
    employee_data = generate_employee_data(num_records)
    print(employee_data)

    
    save_to_csv(employee_data)

    # You can adapt the following for database insertion
    print("\n--- Example of generated data (first 5 records) ---")
    for i, record in enumerate(employee_data[:5]):
        print(f"Record {i+1}:")
        for key, value in record.items():
            print(f"  {key}: {value}")
        print("-" * 20)

    # print("\nTo populate a database, you would typically:")
    # print("1. Install a database driver (e.g., psycopg2 for PostgreSQL, mysql-connector-python for MySQL).")
    # print("2. Establish a connection to your database.")
    # print("3. Create a table with the appropriate schema (e.g., name TEXT, phone_number TEXT, job_title TEXT, work_location TEXT, salary INTEGER).")
    # print("4. Iterate through the generated 'employee_data' and execute SQL INSERT statements to add each record to the table.")
    # print("5. Commit the transaction and close the database connection.")


if __name__ == "__main__":
    main()