'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);

const {offerKeys, commentKeys, entityNames} = require(`../constants/entities`);
const entityValidator = require(`../middlewares/entityValidator`);
const offerExist = require(`../middlewares/offerExist`);
const commentExist = require(`../middlewares/commentExists`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/offers`, route);

  route.get(`/`, (req, res) => {
    const offers = service.findAll();

    return res.status(StatusCodes.OK)
      .json(offers);
  });

  route.post(`/`, entityValidator(offerKeys, entityNames.OFFER), (req, res) => {
    const offer = service.create(req.body);

    return res.status(StatusCodes.CREATED)
      .json(offer);
  });

  route.get(`/:offerId`, offerExist(service), (req, res) => {
    const {offer} = res.locals;

    return res.status(StatusCodes.OK)
      .json(offer);
  });

  route.put(`/:offerId`, [offerExist(service), entityValidator(offerKeys, entityNames.OFFER)], (req, res) => {
    const {offerId} = req.params;

    const newOffer = service.update(offerId, req.body);

    return res.status(StatusCodes.OK)
      .json(newOffer);
  });

  route.delete(`/:offerId`, offerExist(service), (req, res) => {
    const {offerId} = req.params;

    const deletedOffer = service.drop(offerId);

    return res.status(StatusCodes.OK)
      .json(deletedOffer);
  });

  route.get(`/:offerId/comments`, offerExist(service), (req, res) => {
    const {offer} = res.locals;

    const comments = service.findAllComments(offer);

    return res.status(StatusCodes.OK)
      .json(comments);
  });

  route.post(`/:offerId/comments/`, [offerExist(service), entityValidator(commentKeys, entityNames.COMMENT)], (req, res) => {
    const {offer} = res.locals;

    const newComment = service.createComment(offer, req.body);

    return res.status(StatusCodes.CREATED)
      .json(newComment);
  });

  route.delete(`/:offerId/comments/:commentId`, [offerExist(service), commentExist(service), entityValidator(commentKeys, entityNames.COMMENT)], (req, res) => {
    const {offer} = res.locals;
    const {commentId} = req.params;

    const deletedComment = service.dropComment(offer, commentId);

    return res.status(StatusCodes.OK)
      .json(deletedComment);
  });
};
