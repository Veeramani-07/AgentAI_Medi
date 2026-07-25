/*
# Add Liquid form to medicines catalog
Adds 'Liquid' to the allowed medicine forms so antiseptics (Savlon, Dettol)
and syrups can be stored correctly.
*/
ALTER TABLE medicines DROP CONSTRAINT IF EXISTS medicines_form_check;
ALTER TABLE medicines ADD CONSTRAINT medicines_form_check
  CHECK (form IN ('Tablet','Capsule','Syrup','Liquid','Injection','Inhaler','Drops',
                  'Cream','Ointment','Powder','Spray','Device'));
