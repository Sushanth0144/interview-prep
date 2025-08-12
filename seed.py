# backend/seed.py
from main import app
from app.models import db, Topic, Question, User
from werkzeug.security import generate_password_hash

with app.app_context():
    # Reset DB
    db.drop_all()
    db.create_all()

    # ---------------- USERS ----------------
    admin_user = User(
        username="SushanthK1",
        password=generate_password_hash("Behealthy#12345"),
        role="admin"
    )
    normal_user = User(
        username="user",
        password=generate_password_hash("User@123"),
        role="user"
    )
    db.session.add_all([admin_user, normal_user])
    db.session.commit()
    print("✅ Admin and user accounts created!")
    

    # ---------------- TOPICS ----------------
    html = Topic(
        name='HTML',
        description='Basics of HTML for structuring web pages.',
        link='https://developer.mozilla.org/en-US/docs/Web/HTML',
        image='html.png'
    )
    css = Topic(
        name='CSS',
        description='Basics of CSS for styling web pages.',
        link='https://developer.mozilla.org/en-US/docs/Web/CSS',
        image='css_s.png'
    )
    js = Topic(
        name='JavaScript',
        description='Basics of JavaScript for interactive web pages.',
        link='https://developer.mozilla.org/en-US/docs/Web/JavaScript',
        image='jp_s.jpg'
    )
    angular = Topic(
        name='Angular',
        description='Angular framework for building dynamic web applications.',
        link='https://angular.dev',
        image='angular.png'
    )

    db.session.add_all([html, css, js, angular])
    db.session.commit()

    # ---------------- QUESTIONS ----------------
    db.session.add_all([
        # HTML
        Question(text="What is the purpose of the <!DOCTYPE> declaration?", topic=html),
        Question(text="Explain the difference between block-level and inline elements.", topic=html),
        Question(text="What are semantic HTML elements and why are they important?", topic=html),
        Question(text="Explain the difference between <section>, <article>, and <div>.", topic=html),
        Question(text="What are HTML5 localStorage and sessionStorage?", topic=html),

        # CSS
        Question(text="What is the difference between relative, absolute, fixed, and sticky positioning in CSS?", topic=css),
        Question(text="Explain the difference between inline, inline-block, and block elements in CSS.", topic=css),
        Question(text="What is the difference between em, rem, px, and % in CSS?", topic=css),
        Question(text="What is the difference between CSS Grid and Flexbox?", topic=css),
        Question(text="How does the CSS specificity hierarchy work?", topic=css),

        # JavaScript
        Question(text="What is the difference between var, let, and const in JavaScript?", topic=js),
        Question(text="Explain event delegation in JavaScript with an example.", topic=js),
        Question(text="What are JavaScript closures and why are they useful?", topic=js),
        Question(text="Explain the difference between synchronous and asynchronous programming.", topic=js),
        Question(text="What is the difference between call, apply, and bind in JavaScript?", topic=js),

        # Angular
        Question(text="What is Angular and how is it different from AngularJS?", topic=angular),
        Question(text="Explain the concept of components and modules in Angular.", topic=angular),
        Question(text="What are Angular services and dependency injection?", topic=angular),
        Question(text="What is RxJS and how is it used in Angular?", topic=angular),
        Question(text="Explain the difference between Template-driven and Reactive forms.", topic=angular),
    ])
    db.session.commit()

    print("✅ Database seeded successfully with topics, questions, and users!")
