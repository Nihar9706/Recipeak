import { Router } from 'express';
import authRoutes from './auth.routes';
import categoryRoutes from './category.routes';
import recipeRoutes from './recipe.routes';
import userRoutes from './user.routes';


export const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/recipes', recipeRoutes);
apiRouter.use('/users', userRoutes);
