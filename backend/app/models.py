from . import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), default='user')  # 'user' or 'admin'

    def is_admin(self):
        return self.role == 'admin'


class Topic(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)        # Description of the topic
    link = db.Column(db.String(255))        # Reference link
    image = db.Column(db.String(255))       # ✅ Image filename for frontend

    # Relationship to questions
    questions = db.relationship('Question', backref='topic', lazy=True)


class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    topic_id = db.Column(db.Integer, db.ForeignKey('topic.id'), nullable=False)
