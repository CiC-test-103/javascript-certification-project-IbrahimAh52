// Necessary Imports (you will need to use this)
const { Student } = require('./Student')
const fs = require('fs').promises;
/**
 * Node Class (GIVEN, you will need to use this)
 */
class Node {
  // Public Fields
  data               // Student
  next               // Object
  /**
   * REQUIRES:  The fields specified above
   * EFFECTS:   Creates a new Node instance
   * RETURNS:   None
   */
  constructor(data, next = null) {
    this.data = data;
    this.next = next
  }
}

/**
 * Create LinkedList Class (for student management)
 * The class should have the public fields:
 * - head, tail, length
 */
class LinkedList {
  // Public Fields
  head              // Object
  tail              // Object
  length            // Number representing size of LinkedList

  /**
   * REQUIRES:  None
   * EFFECTS:   Creates a new LinkedList instance (empty)
   * RETURNS:   None
   */
  constructor() {
    // TODO
    this.head = null; // first head so its null for now
    this.tail = null; // list starts empty there is no last node
    this.length = 0; // list starts empty so theres no length to set 
  }

  /**
   * REQUIRES:  A new student (Student)
   * EFFECTS:   Adds a Student to the end of the LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about adding to the 'end' of the LinkedList (Hint: tail)
   */
  addStudent(newStudent) {
    // TODO
    const newNode = new Node(newStudent);  // Create a new node with the student

    if (!this.head) {  // If the list is empty
      this.head = newNode;  // Set head to the new node
      this.tail = newNode;  // Set tail to the new node
    } else {  // If the list is not empty
      this.tail.next = newNode;  // Link the new node to the current tail
      this.tail = newNode;       // Update the tail to the new node 
    }

    this.length++;  // Increase the length of the list
                
  }

  /**
   * REQUIRES:  email(String)
   * EFFECTS:   Removes a student by email (assume unique)
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about how removal might update head or tail
   */
  removeStudent(email) {
    // TODO
    if (!this.head) return;  // If list is empty, nothing to remove

    if (this.head.data.getEmail() === email) {  // Check if head is the student to remove
        this.head = this.head.next;  // Move head to the next node
        if (!this.head) this.tail = null;  // If list is now empty, update tail
        this.length--;  // Decrease length
        return;
    }

    let current = this.head;
    while (current.next) {
        if (current.next.data.getEmail() === email) {  
            current.next = current.next.next;  // Remove node by skipping it
            if (!current.next) this.tail = current;  // If last node is removed, update tail
            this.length--;  // Decrease length
            return;
        }
        current = current.next;
    }
  }

  /**
   * REQUIRES:  email (String)
   * EFFECTS:   None
   * RETURNS:   The Student or -1 if not found
   */
  findStudent(email) {
    // TODO
    let current = this.head;
    while (current) {
        if (current.data.getEmail() === email) {
            return current.data;  // Return the Student object (not the Node)
        }
        current = current.next;
    }
    return -1;
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   Clears all students from the Linked List
   * RETURNS:   None
   */
  clearStudents() {
    // TODO
    this.head = null; 
    this.tail = null; 
    this.length = 0; 
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   LinkedList as a String for console.log in caller
   * CONSIDERATIONS:
   *  - Let's assume you have a LinkedList with two people
   *  - Output should appear as: "JohnDoe, JaneDoe"
   */
  displayStudents() {
    // TODO
    let current = this.head;
    let studentsList = [];
    while (current) {
      studentsList.push(current.data.getName());  // Collecting each student's name
      current = current.next;  // Move to the next node
    }
    return studentsList.join(', ');  // Join names with a comma
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   A sorted array of students by name
   */
  #sortStudentsByName(students) {
    // TODO
    return students.sort((a, b) => a.getName().localeCompare(b.getName()));
  }

  /**
   * REQUIRES:  specialization (String)
   * EFFECTS:   None
   * RETURNS:   An array of students matching the specialization, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterBySpecialization(specialization) {
    // TODO
    let filtered = [];
    let current = this.head;
    while (current) {
      if (current.data.getSpecialization() === specialization) {
        filtered.push(current.data);
      }
      current = current.next;
    }
    return this.#sortStudentsByName(filtered);
  }

  /**
   * REQUIRES:  minAge (Number)
   * EFFECTS:   None
   * RETURNS:   An array of students who are at least minAge, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterByMinYear(minYear) {
    // TODO
    let filtered = [];
    let current = this.head;
    while (current) {
      if (current.data.getYear() >= minYear) {
        filtered.push(current.data);
      }
      current = current.next;
    }
    return this.#sortStudentsByName(filtered);
  }

  /**
   * REQUIRES:  A valid file name (String)
   * EFFECTS:   Writes the LinkedList to a JSON file with the specified file name
   * RETURNS:   None
   */
  async saveToJson(fileName) {
    // TODO
    const students = [];
    let current = this.head;
    while (current) {
      students.push({
        name: current.data.getName(),
        year: current.data.getYear(),
        email: current.data.getEmail(),
        specialization: current.data.getSpecialization()
      });
      current = current.next;
    }
    await fs.writeFile(fileName, JSON.stringify(students, null, 2));
  }

  /**
   * REQUIRES:  A valid file name (String) that exists
   * EFFECTS:   Loads data from the specified fileName, overwrites existing LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   *  - Use clearStudents() to perform overwriting
   */
  async loadFromJSON(fileName) {
    // TODO
    try {
      const data = await fs.readFile(fileName, 'utf-8');
      const students = JSON.parse(data);

      this.clearStudents();  // Clear existing list before loading new data

      students.forEach(studentData => {
        const student = new Student(studentData.name, studentData.year, studentData.email, studentData.specialization);
        this.addStudent(student);  // Add each student to the linked list
      });
    } catch (error) {
      console.error('Error loading file:', error);
    }
    
  }

}

module.exports = { LinkedList }
