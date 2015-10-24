# Photoport

A web app for you to independantly host your photos.
I'd like to be able to send you a photo, or a collection of photos without you having to sign up, connect via facebook or really see anything except the photos.
The photo carousel takes the whole window and has no buttons. You navigate with a keyboard, or swipe.
Ultimately it would be good if someone could setup their own Photoport on Amazon with an AMI.

## Installation

Dependencies:
* ImageMagick
* Postgres
* An Amazon S3 account

Then `bundle`.
You will also need to create a `config/aws.yml` based on `config/aws.example.yml`.

## Implementation Limits

* Safari OS X is the only browser tested
* Swipe not implemented
* No AMI
