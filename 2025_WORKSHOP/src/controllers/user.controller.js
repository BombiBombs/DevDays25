import { getAllUsers, getUserById, createUser, deleteUserById, updateUser } from "../services/user.service.js";
import { trace } from '@opentelemetry/api';
import { ConsoleMetricExporter, MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { metrics } from '@opentelemetry/api';
const tracer = trace.getTracer('user-controller-tracer');

export const getUsers = async (req, res) => {
    const span = tracer.startSpan('getUsers');
    try {
        const users = getAllUsers();
        await new Promise(resolve => setTimeout(resolve, 100));
        span.setAttribute('user.count', users.length);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to get users" });
    } finally {
        
        span.end();
    }
};

export const getUser = (req, res) => {
    try {
        const user = getUserById(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to get user" });
    }
};

const meter = metrics.getMeter('user-controller-meter');
const userCreationCounter = meter.createCounter('user_creation_count', {
    description: 'Counts number of users created',
    unit: "users",
});
export const addUser = (req, res) => {

    try {
        const newUser = createUser(req.body);
        userCreationCounter.add(1);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const removeUser = (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = deleteUserById(id);
        if (deletedUser) {
            res.status(200).json(deletedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const modifyUser = (req, res) => {
    try {
        const { id } = req.params;
        console.log('Updating user with id:', id, 'body:', req.body);
        const updatedUser = updateUser(id, req.body);
        console.log('Updated user:', updatedUser);
        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};